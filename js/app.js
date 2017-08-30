'use strict';

const theme = 'Hurricane Harvey';
const presetSearchTerms = ['flooding', 'relief', 'forecast'];

// call all necessary functions to load the page
function initApp () {

  // get most viewied videos, before user search, just send main theme as "q"
  getMostViewedVideos(theme);

  // get #flooding, #relief and #forecast videos
  presetSearchTerms.map( term => {
    getFilteredVideos(term);
  });

  // listen for search
  listenForSearchFormSubmit();

  // listen for preview clicks
  listenForPreviewClicks();

}


// call api for most viewed videos
function getMostViewedVideos (q) {

  // call youtube API with 'q' parameter
  callYouTubeSearchAPI(q, listMostViewedVideos);

}

// gets filtered videos, starts with preset search terms
function getFilteredVideos (q) {

  // call youtube API with themified search term
  callYouTubeSearchAPI (forceThemedSearchTerm(q), listFilteredVideos);

}


// populate most viewed videos list, on load, used to set main video content
function listMostViewedVideos (data) {

  // clear most viewed html to start fresh
  resetHTML('.js-most-viewed-list');

  // loop thru data to create most viewed ul li's
  data.items.map( (item, index) => {

    // if first item, send to main video
    if (index === 0){
      setMainVideo(item);
    }

    // setup li html with data
    const template = `
      <li>
        <a href="#" videoID="${item.id.videoId}" class="js-preview-btn">
          <div class="video-thumb">
            <div class="desc">${trimString(item.snippet.title.toString(), 59)}</div>
            <div class="thumb"><img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title} image"></div>
          </div>
        </a>
      </li>
    `;

    // append li to ul
    $('.js-most-viewed-list').append(template);

  });

}

// function that lists filtered results
function listFilteredVideos (data) {

  // loop thru data to create most viewed ul li's
  data.items.map( (item, index) => {

    // setup li html with data
    const template = `
      <li>
        <a href="#" videoID="${item.id.videoId}" class="js-preview-btn">
          <div class="video-thumb">
            <div class="desc">${trimString(item.snippet.title.toString(), 99)}</div>
            <div class="thumb"><img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title} image"></div>
          </div>
        </a>
      </li>
    `;

    // append li to ul
    $(`.js-${index}-list`).append(template);

  });

}


// listen for search submit event
function listenForSearchFormSubmit () {

  $('.search-form').submit( event => {
    event.preventDefault();

    // search term passed
    const searchTermPassed = $('#searchTerm').val();

    // setup forced theme search
    const searchTerm = forceThemedSearchTerm(searchTermPassed);

    // call to API, reset most viewed content with search results
    callYouTubeSearchAPI(searchTerm, listMostViewedVideos);

    // update most viewed header
    $('.js-most-viewed-list-header').html(`Results for: ${trimString(searchTermPassed, 15)}`);

    // clear input
    $('#searchTerm').val('');

  });

}

// process thumbnail clicks, set as main video
function listenForPreviewClicks () {

  $('ul').click( event => {
    event.preventDefault();

    // get a tag info
    const anchorClicked = $(event.target).closest('a');

    // call video api
    callYouTubeVideoAPI(anchorClicked[0].attributes.videoID.value, updateMainVideoFromAnchorClick);

  });

}

// reset main video content from anchor link
function updateMainVideoFromAnchorClick (videoObj) {

  // reset html to start fresh
  resetHTML('.video-player');

  // set template
  const template = `
    <header><h4 class="js-main-video-title">${trimString(videoObj.items[0].snippet.title, 75)}</h4></header>
    <div class="iframe-container">
      <iframe width="320" height="180" src="https://www.youtube.com/embed/${videoObj.items[0].id}" frameborder="0" class="js-main-video-iframe" allowfullscreen></iframe>
    </div>
    <h3 class="js-main-video-channel">From: ${videoObj.items[0].snippet.channelTitle}</h3>
    <p class="js-main-video-description">${videoObj.items[0].snippet.description}</p>
  `;

  $('.video-player').append(template);

  // scroll to top of page
  $(window).scrollTop(0);

}

// populates main video content
function setMainVideo (videoObj) {

  // reset html to start fresh
  resetHTML('.video-player');

  // set template
  const template = `
    <header><h4 class="js-main-video-title">${videoObj.snippet.title}</h4></header>
    <div class="iframe-container">
      <iframe width="320" height="180" src="https://www.youtube.com/embed/${videoObj.id.videoId}" frameborder="0" class="js-main-video-iframe" allowfullscreen></iframe>
    </div>
    <h3 class="js-main-video-channel">From: ${videoObj.snippet.channelTitle}</h3>
    <p class="js-main-video-description">${videoObj.snippet.description}</p>
  `;

  $('.video-player').append(template);

}


// calls youtube search API with search term and credentials
function callYouTubeSearchAPI (q, callback) {

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

// calls youtube search API with search term and credentials
function callYouTubeVideoAPI (videoID, callback) {

  // set API call parameters
  const settings = {
    url: 'https://www.googleapis.com/youtube/v3/videos',
    data: {
      part: 'snippet,contentDetails,statistics',
      key: 'AIzaSyBAPx_IKzkO0KLZ9TOGGcLTUixNZmFRiX4',
      id: videoID
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);

}

// force theme to be first part of search term
function forceThemedSearchTerm (q) {

  // concat theme in front of search term
  return `${theme}+${q}`;

}

// trim the video description for preview lists
function trimString (str, trimAt) {
  return `${str.substring(0, trimAt)}...`;
}

// reset element HTML
function resetHTML (element) {
  $(element).html('');
}

$(initApp)
