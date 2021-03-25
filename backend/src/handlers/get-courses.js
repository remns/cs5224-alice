const data = require("./../../data/course-data.json");

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
        reponseData = responseData.map((course) => course.ROI = getROI(course)); // Append ROI field
        reponseData = responseData.map((course) => course.Entry_Probability = getEntryProbability(course, body)); // Append probability field
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


function getROI(course) {
    gesData = course.GES
    if (gesData == null) {
        return "Unavailable"
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
            return "Unavailable"
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
            return "Unavailable"
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
        if (percentage == "NA") return "Unavailable"
        return percentage < 0.1 ? "Low" : "High"
    } catch (error) {
        return "Unavailable"
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
        if (percentage == "NA") return "Unavailable"
        return percentage < 0.1 ? "Low" : "High"
    } catch (error) {
        return "Unavailable"
    }
}

function getEntryProbability_Jc_NUSNTUSMU (course, body) {
    grades = body.Profile.Grades
    gradeString = ''.concat(grades[0]).concat(grades[1]).concat(grades[2]).concat("/").concat(grades[3])
    try {
        igp = course["Indicative Grade Profile"]["A-Levels 10th Percentile"]
            if (igp.localeCompare(gradeString) == 1) { // i.e. B> A
                return "High"
            } else if (igp.localeCompare(gradeString) == 0) {
                return "High"
            }
            else {
                return "Low"
            }
    } catch(error) {
        return "Unavailable"
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
            return "Unavailable"
    }
}

function getEntryProbability_Poly_NUSNTUSMU(course, gpa) {
    try {
        igp = course["Indicative Grade Profile"]["Polytechnic 10th Percentile"]
        if (gpa < igp) {
            return "Low"
        }
        else {
            return "High"
        }
    }
    catch (error) {
        return "Unavailable"
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
        return percentage < 0.1 ? "Low" : "High"
    } catch (error) {
        return "Unavailable"
    }
} 

function getEntryProbability_Poly_SUSS(course, gpa) {
    try {
        if (gpa < 3.0) {
            percentage = course["Indicative Grade Profile"]["Polytechnic (<3.00)"]
        } else {
            percentage = course["Indicative Grade Profile"]["Polytechnic (3.00 - 4.00)"]
        }
        return percentage < 0.1 ? "Low" : "High"
    } catch (error) {
        return "Unavailable"
    }
}