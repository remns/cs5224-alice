// replace with server link
const IMAGE_LINK = '/images/';

function getUniversityLogoLink(uniName) {
  let updatedUniName = uniName.split(' ').join('_');
  let imageURL = IMAGE_LINK + updatedUniName + '.png';
  return imageURL;
}

export default {
  getUniversityLogoLink
}