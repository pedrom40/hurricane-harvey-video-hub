'use strict';

const theme = 'Hurricane Harvey';
const presetSearchTerms = ['flooding', 'relief', 'forecast'];

// call all necessary functions to load the page
function initApp () {
  console.log('init app called');

  // get most viewied videos, before user search, just send main theme as "q"
  getMostViewedVideos(theme);

  // get #flooding, #relief and #forecast videos
  presetSearchTerms.map( term => {
    getFilteredVideos(term);
  });

}

// call api for most viewed videos
function getMostViewedVideos (q) {
  console.log(`getMostViewedVideos() called with search term: ${q}`);

  // call youtube API with 'q' parameter
  callYouTubeAPI(q, listMostViewedVideos);

}

// gets filtered videos, starts with preset search terms
function getFilteredVideos (q) {
  console.log(`getFilteredVideos() called with: ${q}`);

  // call youtube API with themified search term
  callYouTubeAPI (forceThemedSearchTerm(q), listFilteredVideos);

}

// function that lists filtered results
function listFilteredVideos (data) {
  console.log(`listFilteredVideos() called with:`);
  console.log(data);

  // loop over data to fill ul

}

// force theme to be first part of search term
function forceThemedSearchTerm (q) {

  // concat theme in front of search term
  return `${theme}+${q}`;

}

// populate most viewed videos list
function listMostViewedVideos (data) {
  console.log('listMostViewedVideos() called with the following data:');
  console.log(data);

  // loop thru data to create most viewed ul li's

    // on first pass, set main video content
    setMainVideo('videoObj');

  // end loop

}

// populates main video content
function setMainVideo (videoObj) {
  console.log('setMainVideo() called');
}

// calls youtube API with search term and credentials
function callYouTubeAPI (q, callback) {
  console.log(`callYouTubeAPI called with search term: ${q} and callback function: listMostViewedVideos()`);

  // set API call parameters
  const settings = {
    url: 'https://www.googleapis.com/youtube/v3/search/',
    data: {
      part: 'snippet',
      key: 'AIzaSyBAPx_IKzkO0KLZ9TOGGcLTUixNZmFRiX4',
      q: q,
      order: 'viewCount'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);

}

$(initApp)
