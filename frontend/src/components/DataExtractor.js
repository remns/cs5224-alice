function isEmpty(input){
  if (input !== "" && input !== "NA" & input !== "NaN") {
    return false;
  }

  return true;
}

function getMedianSalary(course) {
  let medianPay = "";

  if (!course['GES']) {
    return null;
  }

  for (let key in course['GES']) {
    let ges = course['GES'][key];
    if (ges['Basic Monthly Median'] !== "" && ges['Basic Monthly Median'] !== "NA") {
      medianPay = ges['Basic Monthly Median'];
    }
  }

  if (medianPay === "") {
    return null;
  }

  return medianPay;
}

function getEmploymentRate(course) {
  let employmentRate = "";

  if (!course['GES']) {
    return null;
  }

  for (let key in course['GES']) {
    let ges = course['GES'][key];
    if (ges['Overall Employment'] !== "" && ges['Overall Employment'] !== "NA") {
      employmentRate = ges['Overall Employment'];
    }
  }

  if (employmentRate === "") {
    return null;
  }

  return employmentRate;
}

function getGESYear(course) {
  // get valid GES Year
  let year = "";

  if (!course['GES']) {
    return null;
  }

  for (let key in course['GES']) {
    let ges = course['GES'][key];
    if (ges['Basic Monthly Median'] !== "" && ges['Basic Monthly Median'] !== "NA") {
      year = ges['Year'];
    }
  }

  if (year === "") {
    return null;
  }

  return year;
}

function getAnnualCost(course) {
  if (course['Fee Type'] === 'One-Time') {
    return (course['Fee Citizen'] / course['Duration']).toFixed(0);
  }

  // Annual
  return course['Fee Citizen'];
}

function getROI(course) {
  return course['ROI'];
}

export default {
  isEmpty,
  getMedianSalary,
  getEmploymentRate,
  getGESYear,
  getAnnualCost,
  getROI
}
