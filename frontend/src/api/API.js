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


export {
  getAllUniversity,
  getAllInterest,
  getAllCourses,
  getAllJC,
  getAllPoly,
  getAllStatistics,
  getAllTrackClicks
}
