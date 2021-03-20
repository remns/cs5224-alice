const data = require("./../../data/course-data.json");

exports.getCoursesHandler = async (event) => {
    const { httpMethod, path } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`${httpMethod} method not allowed.`);
    }
    console.log('received:', JSON.stringify(event));

    /* Parameters:
        {
            "Filters": {
                "University": [
                    "National University of Singapore",
                    "Nanyang Technological University"
                ],
                "Category": [
                    "Infocomm Technology",
                    "Engineering"
                ]
            }
            "Profile" : {
                "School Type": "Junior College"
                "School" : "national junior college"
                "Grades" : {
                    "H2" : [
                        "Physics" : "A",
                        "Chemistry": "B"
                        "Math": "C"
                    ],
                    "H1": [
                        "literature": "A"
                    ],
                    "Project Work": "B",
                    "Mother Tongue": "A",
                    "General Paper": "B"
                }
            }
            or
            "Profile" : {
                "School Type": "Polytechnic"
                "School" : "Nanyang Polytechnic"
                "Grades" : {
                    "GPA": 3.74
                }
            }
        }
     */
    var responseData = data;

    if (event.body) {
        let body = JSON.parse(event.body);        
        let uniFilter = body.Filters.University;
        let interestsFilter = body.Filters.Category;
        
        if (uniFilter) {
            responseData = responseData.filter(x => uniFilter.includes(x.University));
        }
        if (interestsFilter) {
            responseData = responseData.filter(x=> x.Category.some(y=> interestsFilter.includes(y)));
        }

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
