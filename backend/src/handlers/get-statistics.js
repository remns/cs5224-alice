const dataFile = require("./../../data/course-data.json");
const enrollmentDataFile = require("./../../data/enrollment-data.json");
ges_cache = [];
igp_cache = [];
enrollment_cache = [];

/*
Description: Get statistics for each course and sorted in descending order by a specific category
HTTP Method: GET
HTTP Parameters (query string): 
    - limit=<number>, limits the number of results returned. If not specified, full list of courses will be returned
    - category=<GES or IGP or Enrollment Category>, results will be sorted according to this category. If not specified, results will not be sorted.
*/
exports.getStatisticsHandler = async (event) => {
    const { httpMethod, path, queryStringParameters } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    console.log('received:', JSON.stringify(event));

    let gesCats = ["Overall Employment", "Full-Time Employment", "Basic Monthly Mean", "Basic Monthly Median", "Gross Monthly Mean", "Gross Monthly Median", "Gross Monthly 25th Percentile", "Gross Monthly 75th Percentile"];
    let igpCats = ["A-Levels 10th Percentile", "A-Levels 90th Percentile", "Polytechnic 10th Percentile", "Polytechnic 90th Percentile"];
    let enrollment = ["Intake"];

    let error = false;

    var responseData = [];    

    if (queryStringParameters) {
        if (gesCats.includes(queryStringParameters.category)) {
            fillGesCache();
            switch(queryStringParameters.category) {
                case "Overall Employment":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Overall Employment": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Overall Employment": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Overall Employment'] - a['Overall Employment'])
                    break;
                case "Full-Time Employment":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Full-Time Employment": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Full-Time Employment": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Full-Time Employment'] - a['Full-Time Employment'])
                    break;
                case "Basic Monthly Mean":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Mean": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Mean": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Basic Monthly Mean'] - a['Basic Monthly Mean'])
                    break;
                case "Basic Monthly Median":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Median": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Median": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Basic Monthly Median'] - a['Basic Monthly Median'])
                    break;
                case "Gross Monthly Mean":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Mean": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Mean": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly Mean'] - a['Gross Monthly Mean'])
                    break;
                case "Gross Monthly Median":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Median": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Median": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly Median'] - a['Gross Monthly Median'])
                    break;
                case "Gross Monthly 25th Percentile":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 25th Percentile": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 25th Percentile": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly 25th Percentile'] - a['Gross Monthly 25th Percentile'])
                    break;
                case "Gross Monthly 75th Percentile":
                    responseData = ges_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 75th Percentile": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 75th Percentile": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly 75th Percentile'] - a['Gross Monthly 75th Percentile'])
                    break;
            }     
            
        }
        else if (igpCats.includes(queryStringParameters.category)) {
            fillIgpCache();
            switch(queryStringParameters.category) {
                case "A-Levels 10th Percentile":
                    responseData = filterAndSortByCategoryString(igp_cache, "A-Levels 10th Percentile");
                    break;
                case "A-Levels 90th Percentile":
                    responseData = filterAndSortByCategoryString(igp_cache, "A-Levels 90th Percentile");
                    break;
                case "Polytechnic 10th Percentile":
                    responseData = filterAndSortByCategoryNumber(igp_cache, "Polytechnic 10th Percentile");
                    break;
                case "Polytechnic 90th Percentile":
                    responseData = filterAndSortByCategoryNumber(igp_cache, "Polytechnic 90th Percentile");
                    break;
            }
        }
        else if (enrollment.includes(queryStringParameters.category)) {
            fillEnrollmentCache();
            responseData = enrollment_cache.sort((a, b) => b['Intake'] - a['Intake']);
        }
        else {
            console.log("invalid category option");
            error = true;
        }
    }
    else {
        console.log("no category parameter supplied")
        error = true;
    }

    if (!error && queryStringParameters.limit !== undefined) {
        responseData = responseData.slice(0, queryStringParameters.limit);
    }

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

function fillGesCache() {
    if (ges_cache.length === 0) {
        console.log("Calculating GES statistics");
        dataFile.forEach(course => {
            
            if(!course.GES) {
                // not all course have GES
                console.log(`Missing GES data for ${course["Course Code"]} (${course.Id})`);
            }
            else {
                try{
                    var overall = 0;
                    var fte = 0;
                    var basicMean = 0;
                    var basicMedian = 0;
                    var grossMean = 0;
                    var grossMedian = 0;
                    var gross25 = 0;
                    var gross75 = 0;
                    let years = course.GES.length;

                    course.GES.forEach(ges => {
                        overall += ges["Overall Employment"];
                        fte += ges["Full-Time Employment"];
                        basicMean += ges["Basic Monthly Mean"];
                        basicMedian += ges["Basic Monthly Median"];
                        grossMean += ges["Gross Monthly Mean"];
                        grossMedian += ges["Gross Monthly Median"];
                        gross25 += ges["Gross Monthly 25th Percentile"];
                        gross75 += ges["Gross Monthly 75th Percentile"];
                    })

                    ges_cache.push({
                        "Id": course.Id,
                        "Course Code": course["Course Code"],
                        "University": course.University,
                        "School": course.School,
                        "Programme": course.Programme,
                        "Category": course.Category,
                        "Overall Employment" : parseFloat(overall/years).toFixed(2),
                        "Full-Time Employment" : parseFloat(fte/years).toFixed(2),
                        "Basic Monthly Mean": parseFloat(basicMean/years).toFixed(2),
                        "Basic Monthly Median": parseFloat(basicMedian/years).toFixed(2),
                        "Gross Monthly Mean": parseFloat(grossMean/years).toFixed(2),
                        "Gross Monthly Median": parseFloat(grossMedian/years).toFixed(2),
                        "Gross Monthly 25th Percentile": parseFloat(gross25/years).toFixed(2),
                        "Gross Monthly 75th Percentile": parseFloat(gross75/years).toFixed(2)
                    })
                }
                catch(error) {
                    console.error(`Failed parsing data for ${course["Course Code"]} (${course.Id})`);
                }
            }
        })
    }
}

function fillIgpCache() {
    if (igp_cache.length === 0) {
        console.log("Sorting IGP data");

        let uniFilter = ["National University of Singapore", "Nanyang Technological University", "Singapore Management University"]

        igp_cache = dataFile
            .filter(x => uniFilter.includes(x.University))
            .map(x=> (
                ({Id, "Course Code": courseCode, "Indicative Grade Profile": igp}) => 
                ({Id, "Course Code": courseCode, "Indicative Grade Profile": igp})
                )
                (x));
    }
}

function fillEnrollmentCache() {
    if (enrollment_cache.length === 0) {
        console.log("Retrieving enrollment data");

        enrollment_cache = enrollmentDataFile
            .map(x=> 
                ({"Course Code": Programme, "Intake": Intake})
                (x));
    }
}

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