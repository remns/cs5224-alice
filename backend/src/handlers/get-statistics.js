const dataFile = require("./../../data/course-data.json");
stats_cache = [];

/*
Description: Get aggregated GES statistics for each course and sorted in descending order by a specific category
HTTP Method: GET
HTTP Parameters (query string): 
    - limit=<number>, limits the number of results returned. If not specified, full list of courses will be returned
    - category=<GES Category>, results will be sorted according to this category. If not specified, results will not be sorted.
*/
exports.getStatisticsHandler = async (event) => {
    const { httpMethod, path, queryStringParameters } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    console.log('received:', JSON.stringify(event));

    if (stats_cache.length === 0) {
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

                    stats_cache.push({
                        "Id": course.Id,
                        "Course Code": course["Course Code"],
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

    var responseData = [];    

    if(queryStringParameters) {
        if (queryStringParameters.category !== undefined) {
            switch(queryStringParameters.category) {
                case "Overall Employment":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Overall Employment": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Overall Employment": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Overall Employment'] - a['Overall Employment'])
                    break;
                case "Full-Time Employment":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Full-Time Employment": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Full-Time Employment": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Full-Time Employment'] - a['Full-Time Employment'])
                    break;
                case "Basic Monthly Mean":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Mean": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Mean": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Basic Monthly Mean'] - a['Basic Monthly Mean'])
                    break;
                case "Basic Monthly Median":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Median": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Basic Monthly Median": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Basic Monthly Median'] - a['Basic Monthly Median'])
                    break;
                case "Gross Monthly Mean":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Mean": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Mean": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly Mean'] - a['Gross Monthly Mean'])
                    break;
                case "Gross Monthly Median":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Median": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly Median": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly Median'] - a['Gross Monthly Median'])
                    break;
                case "Gross Monthly 25th Percentile":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 25th Percentile": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 25th Percentile": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly 25th Percentile'] - a['Gross Monthly 25th Percentile'])
                    break;
                case "Gross Monthly 75th Percentile":
                    responseData = stats_cache.map( x => ( 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 75th Percentile": overallEmployment}) => 
                        ({"Id": Id, "Course Code": courseCode, "Gross Monthly 75th Percentile": overallEmployment}) 
                        )
                        (x));                    
                    responseData.sort((a, b) => b['Gross Monthly 75th Percentile'] - a['Gross Monthly 75th Percentile'])
                    break;
                default:
                    responseData = [...stats_cache];
                    break;

            }
        }

        if (queryStringParameters.limit !== undefined) {
            responseData = responseData.slice(0, queryStringParameters.limit);
        }
    }
    else {
        responseData = [...stats_cache];
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseData)
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
