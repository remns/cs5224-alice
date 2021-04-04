function exists(){
  return (localStorage.getItem('configuration') != null);
}

function getConfiguration() {
  return JSON.parse(localStorage.getItem('configuration'));
};

function setConfiguration(university, interest, course, alevel, education, gpa) {
  let state = {
    university: university,
    interest: interest,
    course: course,
    alevel: alevel,
    education: education,
    gpa: gpa
  }

  localStorage.setItem('configuration', JSON.stringify(state));
};

module.exports = {
  getConfiguration,
  setConfiguration,
  exists
};
