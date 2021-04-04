const getCostRating = (annualCost) => {
  let costRating = (annualCost >= 20000) ? 5 : 
                      (annualCost >= 10000) ? 4 :
                      (annualCost >= 8000) ? 3 :
                      (annualCost >= 6000) ? 2 : 1;
  return costRating;
}

const getSalaryRating = (monthlySalary) => {
  let salaryRating = (monthlySalary >= 5000) ? 5 : 
                      (monthlySalary >= 4000) ? 4 :
                      (monthlySalary >= 3000) ? 3 :
                      (monthlySalary >= 2000) ? 2 : 1;
  return salaryRating;
}

export default {
  getCostRating,
  getSalaryRating
}