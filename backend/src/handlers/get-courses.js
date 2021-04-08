const data = require("./../../data/course-data.json");
const dynamodb = require('aws-sdk/clients/dynamodb');

let docClient;
if (process.env.dbEnv === "local") {
    docClient = new dynamodb.DocumentClient({
        endpoint: "http://dynamodb:8000/"
    })
}
else {
    docClient = new dynamodb.DocumentClient();
}

// const tableName = process.env.DDB_TABLE;
const tableName = process.env.DDB_TABLE;

data_cache = [];

exports.getCoursesHandler = async (event) => {
    const { httpMethod, path } = event;
    if (httpMethod !== 'GET' && httpMethod !== 'POST') {
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
                "Grades" : ["A", "B", "C", "D", "A", "A", "A"]
            }
            or
            "Profile" : {
                "School Type": "Polytechnic"
                "School" : "Nanyang Polytechnic"
                "Grades" : 3.74
            }
        }
     */

    if (data_cache.length === 0){
        const params = {
            TableName: tableName,
        }
        await docClient.scan(params).promise()
            .then(function(data){
                data_cache = data["Items"];
            })
            .catch(function(err) {
                throw new Error("Could not retrieve data. " + JSON.stringify(err));
            });
    }

    var responseData = data_cache;
    if (event.body) {
        let body = JSON.parse(event.body); 
        if (body.Filters){
            let uniFilter = body.Filters.University;
            let interestsFilter = body.Filters.Category;
            
            if (uniFilter) {
                responseData = responseData.filter(x => uniFilter.includes(x.University));
            }
            if (interestsFilter) {
                responseData = responseData.filter(x=> x.Category.some(y=> interestsFilter.includes(y)));
            }
        }
        responseData.map((course) => course.ROI = getROI(course)); // Append ROI field
        responseData.map((course) => course.Entry_Probability = getEntryProbability(course, body)); // Append probability field
        responseData.map((course) => course.RecScore = getRecScore(course)); // Append probability field
        responseData = responseData.sort((a, b) => b.RecScore - a.RecScore);
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods": "POST,GET"
        },
        body: JSON.stringify(responseData)
    };

    // console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};

function getRecScore(course) {
    score = 0;
    if (course.ROI >= 1.5) {
        score +=3;
    }
    else if (course.ROI >= 1) {
        score +=2;
    }

    switch(course.Entry_Probability) {
        case "High":
            score +=3
            break;
        case "Medium":
            score +=2;
            break;
        case "Low":
            score +=1;
            break;
        // null is 0 points
    }
    return score;
}

function getROI(course) {
    gesData = course.GES
    if (gesData == null) {
        return null
    } else {
        latestGes = gesData[gesData.length -1]
        grossMonthlyMedian = latestGes["Basic Monthly Median"]
        duration = course.Duration
        feeCitizen = course["Fee Citizen"]
        fullTimeEmployment = latestGes["Full-Time Employment"]
        courseType = course["Fee Type"]
        if (grossMonthlyMedian == 'NA' || duration == 'NA'
        || feeCitizen == 'NA' || fullTimeEmployment == 'NA'
        || courseType == 'NA') {
            return null
        }

        if (courseType == "Annual") { 
            fee = feeCitizen * duration
        } else {
            fee = feeCitizen //One-Time
        }
        roi = (grossMonthlyMedian * 12) * fullTimeEmployment / fee, 2
        roiRounded = Math.round(roi * 100) /100
        return roiRounded
    }
}

function getEntryProbability(course, body) {
    if (body.Profile["School Type"] == "Junior College") {
       return getEntryProbabilityJC(course, body)
    } else { // Poly
        return getEntryProbabilityPoly(course, body)
    }
}

function getEntryProbabilityJC (course, body) {
    uni = course.University
    switch (uni) {
        case "National University of Singapore":
            return getEntryProbability_Jc_NUSNTUSMU(course, body)
            break;
        case "Nanyang Technological University":
            return getEntryProbability_Jc_NUSNTUSMU(course, body)
            break
        case "Singapore Management University":
            return getEntryProbability_Jc_NUSNTUSMU(course, body)
            break
        case "Singapore Institute of Technology":
            uas = getUAS(body)
            return getEntryProbability_Jc_SIT(course, uas)
            break
        case "Singapore University of Social Sciences":
            uas = getUAS(body)
            return getEntryProbability_Jc_SUSS(course, uas)
            break
        default: // SUTD
            return null
            break
    }
}

function getUAS(body)  {
    grades = body.Profile.Grades

    point = 0
    for (i = 0; i < grades.length; i++) {
        switch (grades[i]) {
            case "A":
                p = 20
                break
            case "B":
                p = 17.5
                break
            case "C":
                p = 15
                break
            case "D":
                p = 12.5
                break
            case "E":
                p = 10
                break
            case "S":
                p = 5
                break
            case "U":
                p = 0
        }
        if (i > 2) {
            p /= 2
        }
        if (i == 6) {
            pMTL = p
        }
        point += p 
    } 
    pointWithoutMTL = (point - pMTL) 
    pointWithMTL = (point) / 100 * 90

    point = (pointWithoutMTL > pointWithMTL) ? pointWithoutMTL : pointWithMTL
    // console.log(point)      
    return point 
}

function getEntryProbability_Jc_SUSS(course, uas) {
    try {
        if (uas < 60.0) {
            percentage = course["Indicative Grade Profile"]["UAE (<60.00)"]
        }
        else {
            percentage = course["Indicative Grade Profile"]["UAE (60.00 - 90.00)"]
        }
        if (percentage == "NA") return null
        return percentage < 0.1 ? "Low" : percentage < 0.9 ? "Medium" : "High"
    } catch (error) {
        console.error(`getEntryProbability_Jc_SUSS: ${error}`)
        return null
    }
}

function getEntryProbability_Jc_SIT(course, uas) {
    try {
        if (uas <= 70.0) {
            percentage = course["Indicative Grade Profile"]["UAE (<=70.00)"]
        } else if (uas >70 && uas<=80) {
            percentage = course["Indicative Grade Profile"]["UAE (>70.00 to 80.00)"]
            console.log("hellladfke" + percentage)
        }
        else {
            percentage = course["Indicative Grade Profile"]["UAE (>80 to 90)"]
        }
        if (percentage == "NA") return null
        return percentage < 0.1 ? "Low" : percentage < 0.9 ? "Medium" : "High"
    } catch (error) {
        console.error(`getEntryProbability_Jc_SIT: ${error}`)
        return null
    }
}

function makeGradeString(gradeList) {
    var h2 = gradeList.slice(0,3);
    h2.sort();
    return h2.join('').concat('/').concat(grades[3]);
}

function getEntryProbability_Jc_NUSNTUSMU (course, body) {
    grades = body.Profile.Grades
    gradeString = makeGradeString(grades);
    try {
        igp10 = course["Indicative Grade Profile"]["A-Levels 10th Percentile"]
        igp90 = course["Indicative Grade Profile"]["A-Levels 90th Percentile"]
        if (igp10 == "NA") {
            return null;
        }
        if (igp10.localeCompare(gradeString) < 0) {
            // grade is less than 10th percentile
            return "Low"
        }
        else if (igp90.localeCompare(gradeString) < 0) {
            // grade is between 10th & 90th percenile
            return "Medium"
        }
        else {
            return "High"
        }
    } catch(error) {
        console.error(`getEntryProbability_Jc_NUSNTUSMU: ${error}`)
        return null
    }
}

function getEntryProbabilityPoly(course, body) { 
    gpa = body.Profile.Grades
    switch (course.University) {
        case "National University of Singapore":
            return getEntryProbability_Poly_NUSNTUSMU(course, gpa)
        case "Nanyang Technological University":
            return getEntryProbability_Poly_NUSNTUSMU(course, gpa)
        case "Singapore Management University":
            return getEntryProbability_Poly_NUSNTUSMU(course, gpa)
        case "Singapore Institute of Technology":
            return getEntryProbability_Poly_SIT(course, gpa)
        case "Singapore University of Social Sciences":
            return getEntryProbability_Poly_SUSS(course, gpa)
        default: // SUTD
            return null
    }
}

function getEntryProbability_Poly_NUSNTUSMU(course, gpa) {
    try {
        igp10 = course["Indicative Grade Profile"]["Polytechnic 10th Percentile"]
        igp90 = course["Indicative Grade Profile"]["Polytechnic 90th Percentile"]
        console.log(`gpa: ${gpa}, igp10: ${igp10}, igp90: ${igp90}`);
        if (igp10 == "NA") {
            return null;
        }
        if (gpa < igp10) {
            return "Low"
        }
        else if (gpa < igp90) {
            return "Medium"
        }
        else {
            return "High"
        }
    }
    catch (error) {
        console.error(`getEntryProbability_Poly_NUSNTUSMU: ${error}`)
        return null
    }
}

function getEntryProbability_Poly_SIT(course, gpa) {
    try {
        if (gpa < 3.2) {
            percentage = course["Indicative Grade Profile"]["Polytechnic (<3.2)"]
        } else if (gpa >= 3.6) { 
            percentage = course["Indicative Grade Profile"]["Polytechnic (>=3.2 - <3.6)"]
        } else {
            percentage = course["Indicative Grade Profile"]["Polytechnic (3.6 - 4.0)"]
        }
        if (percentage == "NA") {
            return null;
        }
        return percentage < 0.1 ? "Low" : percentage < 0.9 ? "Medium" : "High"
    } catch (error) {
        console.error(`getEntryProbability_Poly_SIT: ${error}`)
        return null
    }
} 

function getEntryProbability_Poly_SUSS(course, gpa) {
    try {
        if (gpa < 3.0) {
            percentage = course["Indicative Grade Profile"]["Polytechnic (<3.00)"]
        } else {
            percentage = course["Indicative Grade Profile"]["Polytechnic (3.00 - 4.00)"]
        }
        if (percentage == "NA") {
            return null;
        }
        return percentage < 0.1 ? "Low" : percentage < 0.9 ? "Medium" : "High"
    } catch (error) {
        console.error(`getEntryProbability_Poly_SUSS: ${error}`)
        return null
    }
}