import {SERVER_URL} from './serverConfig'

function getAllUniversity() {
  const fetchPromise = fetch(SERVER_URL + "/universities")
  return fetchPromise
}

function getAllInterest() {
  const fetchPromise = fetch(SERVER_URL + "/interests")
  return fetchPromise
}

function getAllCourses() {
  const fetchPromise = fetch(SERVER_URL + "/courses")
  return fetchPromise
}

function getAllJC() {
  const fetchPromise = fetch(SERVER_URL + "/juniorcolleges")
  return fetchPromise
}

function getAllPoly() {
  const fetchPromise = fetch(SERVER_URL + "/polytechnics")
  return fetchPromise
}

function getAllStatistics(category, limit) {
  if(!category && !limit){
    const fetchPromise = fetch(SERVER_URL + "/statistics")
    return fetchPromise
  }
  else if(!limit){
    const fetchPromise = fetch(SERVER_URL + "/statistics?category=" + category)
    return fetchPromise
  }
  else{
    const fetchPromise = fetch(SERVER_URL + "/statistics?category=" + category + "&limit=" + limit)
    return fetchPromise
  }
}

function getAllTrackClicks(limit) {
  const fetchPromise = fetch(SERVER_URL + "/statistics-clicks?limit=" + limit)
  return fetchPromise
}

function getAllCourseWithProfile(profile) {
  if (!profile) {
    return null;
  }

  let educationType = ["Polytechnic", "Junior College"];
  let grades = null;
  if (profile.education === 1) {
    grades = profile.gpa;
  }

  if (profile.education === 0) {
    let alevelObj = profile.alevel;
    let gradeArr = [];
    for (let key in alevelObj) {
      gradeArr.push(alevelObj[key]);
    }
    grades = gradeArr;
  }

  let parsedProfile = {
    Filters: {},
    Profile: {
      "School Type": educationType[profile.education],
      "Grades": grades
    }
  }
  let data = {
    method: 'POST',
    body: JSON.stringify(parsedProfile)
  };
  const fetchPromise = fetch(SERVER_URL + "/courses", data);

  return fetchPromise
}


export {
  getAllUniversity,
  getAllInterest,
  getAllCourses,
  getAllJC,
  getAllPoly,
  getAllStatistics,
  getAllTrackClicks,
  getAllCourseWithProfile
}
