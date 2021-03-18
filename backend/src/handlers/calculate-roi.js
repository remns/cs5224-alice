function calculate_roi(data) {
    grossMonthlyMedian = formatDollartoNumeric("$3,000.00")
    fullTimeEmployment = formatPercentage("88.2%")
    feeCitizen = formatDollartoNumeric("$12,650.00")
    duration = "4"

    console.log(fullTimeEmployment)
    
    if (data == "Annual") { // Change this
        fee = feeCitizen * duration
    } else {
        fee = feeCitizen
    }
    roi = ((grossMonthlyMedian * 12) * fullTimeEmployment) / fee
    return roi
}

function formatDollartoNumeric(dollarString) {
    decimalStripped = dollarString.split('.')[0]
    dollarStripped = decimalStripped.split('$')[1]
    commaStripped = dollarStripped.replace(',', '')
    return commaStripped
} 

function formatPercentage(percentageString) {
    return percentageString.split("%")[0] / 100
}
