import {SERVER_URL} from './serverConfig'

function getAllUniversity() {
  const fetchPromise = fetch(SERVER_URL + "/universities")
  return fetchPromise
}

function getAllInterest() {
  const fetchPromise = fetch(SERVER_URL + "/interests")
  return fetchPromise
}

function getAllCourse() {
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


export {
  getAllUniversity,
  getAllInterest,
  getAllCourse,
  getAllJC,
  getAllPoly
}