const data = require("./../../data/course-data.json");
data_cache = [];

/*
Description: Get courses sorted (descending) by Igp. This applies to NUS, NTU & SMU only.
HTTP Method: GET
HTTP Parameters (query string): 
    - limit=<number>, limits the number of results returned. If not specified, full list of courses will be returned
    - category=<IGP Category>, results will be sorted according to this category. Mandatory parameter

IGP Categories:
    "A-Levels 10th Percentile":
    "A-Levels 90th Percentile":
    "Polytechnic 10th Percentile":
    "Polytechnic 90th Percentile":
*/
exports.getCoursesByIgpHandler = async (event) => {
    const { httpMethod, path, queryStringParameters } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    console.log('received:', JSON.stringify(event));

    let error = false;

    if (data_cache.length === 0) {
        console.log("Sorting IGP data");

        let uniFilter = ["National University of Singapore", "Nanyang Technological University", "Singapore Management University"]

        data_cache = data
            .filter(x => uniFilter.includes(x.University))
            .map(x=> (
                ({Id, "Course Code": courseCode, University, School, Programme, Category, "Indicative Grade Profile": igp}) => 
                ({Id, "Course Code": courseCode, University, School, Programme, Category, "Indicative Grade Profile": igp})
                )
                (x));
    }

    var responseData = [];    

    if(queryStringParameters) {
        if (queryStringParameters.category !== undefined) {
            switch(queryStringParameters.category) {
                case "A-Levels 10th Percentile":
                    responseData = filterAndSortByCategoryString(data_cache, "A-Levels 10th Percentile");
                    break;
                case "A-Levels 90th Percentile":
                    responseData = filterAndSortByCategoryString(data_cache, "A-Levels 90th Percentile");
                    break;
                case "Polytechnic 10th Percentile":
                    responseData = filterAndSortByCategoryNumber(data_cache, "Polytechnic 10th Percentile");
                    break;
                case "Polytechnic 90th Percentile":
                    responseData = filterAndSortByCategoryNumber(data_cache, "Polytechnic 90th Percentile");
                    break;
                default:
                    console.log("info: invalid category option")
                    error = true;
                    break;
            }
        }
        else {
            console.log("info: no category parameter")
            error = true;
        }

        if (queryStringParameters.limit !== undefined) {
            responseData = responseData.slice(0, queryStringParameters.limit);
        }
    }
    else {
        console.log("info: no category parameter")
        error = true;
    }

    let response;

    if (!error) {
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: JSON.stringify(responseData)
        };
    }
    else {
        response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin" : "*"
            },
            body: "Invalid value for parameter 'category'"
        }
    }

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};

function filterAndSortByCategoryString(dataset, category) {
    copy = dataset.filter(x=> x["Indicative Grade Profile"][category] !== "NA");
    copy.sort((a,b) => a["Indicative Grade Profile"][category].localeCompare(b["Indicative Grade Profile"][category]));

    return copy;
}

function filterAndSortByCategoryNumber(dataset, category) {
    copy = dataset.filter(x=> x["Indicative Grade Profile"][category] !== "NA");
    copy.sort((a,b) => b["Indicative Grade Profile"][category] - a["Indicative Grade Profile"][category]);

    return copy;
}