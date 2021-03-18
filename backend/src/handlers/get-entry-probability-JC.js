function getEntryProbabilityJC (data, uni, letterGrade) { 
    percentage = ''
    switch (uni) {
        case "National University of Singapore":
            percentage = getEntryProbabilityNUSNTUSMU(data, letterGrade)
            break;
        case "Nanyang Technological University":
            percentage = getEntryProbabilityNUSNTUSMU(data, letterGrade)
            break
        case "Singapore Management University":
            percentage = getEntryProbabilityNUSNTUSMU(data, letterGrade)
            break
        case "Singapore Institute of Technology":
            uas = getUAS(letterGrade)
            percentage = getEntryProbabilitySIT(data, uas)
            break
        case "Singapore University of Social Sciences":
            uas = getUAS(letterGrade)
            percentage = getEntryProbabilitySIT(data, uas)
            break
        default: // SUTD
            return "Not available"
            break
    }
    return (percentage.split("%")[0] / 100) < 0.1 ? "Low" : "High"
}

/*
function getUAS(letterGrade)  {

}
    point = 0
    
    firstH1 = "C"
    secondH2 = "B"
    thirdH2 = "C"
    h1 = "A"
    pw = "D"
    gp = "A"
    mtl = "D"

    var grades = [firstH1, secondH2, thirdH2, h1, pw, gp, mtl]
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
    console.log(pointWithoutMTL)      
    console.log(pointWithMTL)      
    console.log(point)      
    */


    function getEntryProbabilitySUSS(uas) {
        if (uas < 60.0) (
            return // entry.
        ) 
        else {
            return 
        }
    }

    function getEntryProbabilitySIT(uas) {
        if (uas <= 70.0) {
            return 
        } else if (uas > 70 && uas <=80) {
            return 
        } else {
            return    
        }
    }


    function getEntryProbabilityNUSNTUSMU (grade, igp) {
        grade = "AAA/A"
        igp = "AAB/B"
            if (igp.localeCompare(grade) == 1) { // i.e. B> A
                console.log("High Probability")
            } else if (igp.localeCompare(grade) == 0) {
                console.log("High Probability")
            }
            else {
                console.log("Low Probability")
            }
        }
