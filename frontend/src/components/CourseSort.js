import DataExtractor from './DataExtractor';

const sortLabels = [
  {"id": 1, "name": "Median Salary"},
  {"id": 2, "name": "Employment Rate"},
  {"id": 3, "name": "Return on Investment (ROI)"},
  {"id": 4, "name": "Course Fee"}
];

const sortMethods = [
  {"id": 1, "func": sortBy(DataExtractor.getMedianSalary)},
  {"id": 2, "func": sortBy(DataExtractor.getEmploymentRate)},
  {"id": 3, "func": sortBy(DataExtractor.getROI)},
  {"id": 4, "func": sortBy(DataExtractor.getAnnualCost)}
];

function sortBySortId(sortId, courses, isAscending) {
  let copiedCourses = [...courses];

  let sortObj = sortMethods.find(ele => ele.id === sortId);
  let sortFunc = sortObj.func;

  return sortFunc(copiedCourses, isAscending);
}

function sortBy(getValueFunc) {
  return (courses, isAscending) => {
    let courseWithNullVal = courses.filter(course => getValueFunc(course) === null);
    let courseWithValidVal = courses.filter(course => getValueFunc(course) !== null);

    let multiplier = isAscending ? 1 : -1;
    courseWithValidVal.sort((courseA, courseB) => (getValueFunc(courseA) - getValueFunc(courseB)) * multiplier);

    let combinedCourses = [
      ...courseWithValidVal,
      ...courseWithNullVal
    ];

    return combinedCourses;
  };
}

export default {
  sortLabels,
  sortBySortId
}