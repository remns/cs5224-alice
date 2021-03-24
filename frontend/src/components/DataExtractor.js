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

export default {
  getMedianSalary,
  getEmploymentRate,
  getGESYear
}