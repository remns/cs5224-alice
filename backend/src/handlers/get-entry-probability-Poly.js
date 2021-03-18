function getEntryProbabilityPoly(data, uni, gpa) { 
    switch (uni) {
        case "National University of Singapore":
            return getEntryProbabilityNUSNTUSMU(data, gpa)
        case "Nanyang Technological University":
            return getEntryProbabilityNUSNTUSMU(data, gpa)
        case "Singapore Management University":
            return getEntryProbabilityNUSNTUSMU(data, gpa)
        case "Singapore Institute of Technology":
            return getEntryProbabilitySIT(data, gpa)
        case "Singapore University of Social Sciences":
            return getEntryProbabilitySIT(data, gpa)
        default: // SUTD
            return "Not available"
    }
}

function getEntryProbability_Poly_NUSNTUSMU(data, gpa) {
    if (gpa < data) {
        return "Low"
    }
    else {
        return "High"
    }
}

function getEntryProbability_Poly_SIT(gpa) {
    if (gpa < 3.2) {
        return
    } else if (gpa >= 3.6) { 
        return 
    } else {
        return 
    }
} 

function getEntryProbability_Poly_SUSS(gpa) {
    if (gpa < 3.0) {
        return
    } else {
        return 
    }
}

