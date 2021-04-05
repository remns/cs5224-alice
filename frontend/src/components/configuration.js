function exists(){
  return (localStorage.getItem('configuration') !== null);
}

function getConfiguration() {
  return JSON.parse(localStorage.getItem('configuration'));
};

function setConfiguration(university, interest, education, gpa, alevel) {
  // university is ["NTU", "STU"]
  // interest ["ENG"]
  // alevel {h2_1: 'A', h2_2: 'B'...}
  // education: 0 or 1 (0 means POLY, 1 means JC)
  // gpa : 3.0 
  let state = {
    university: university,
    interest: interest,
    education: education,
    gpa: gpa,
    alevel: alevel
  }

  localStorage.setItem('configuration', JSON.stringify(state));
};

function setFilterConfiguration(university, interest) {
  let profile = getConfiguration();
  let newProfile = {
    university: university,
    interest: interest,
    alevel: profile.alevel,
    education: profile.education,
    gpa: profile.gpa
  }

  localStorage.setItem('configuration', JSON.stringify(newProfile));
}

function setGradeConfiguration(education, gpa, alevel) {
  let profile = getConfiguration();
  let newProfile = {
    university: profile.university,
    interest: profile.interest,
    education: education,
    gpa: gpa,
    alevel: alevel
  }

  localStorage.setItem('configuration', JSON.stringify(newProfile));
}

export default {
  getConfiguration,
  setConfiguration,
  exists,
  setFilterConfiguration,
  setGradeConfiguration
};
