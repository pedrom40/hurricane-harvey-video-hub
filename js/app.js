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

}

// call api for most viewed videos
function getMostViewedVideos (q) {

  // call youtube API with 'q' parameter
  callYouTubeAPI(q, listMostViewedVideos);

}

// gets filtered videos, starts with preset search terms
function getFilteredVideos (q) {

  // call youtube API with themified search term
  callYouTubeAPI (forceThemedSearchTerm(q), listFilteredVideos);

}

// populate most viewed videos list, on load, used to set main video content
function listMostViewedVideos (data) {

  // loop thru data to create most viewed ul li's
  data.items.map( (item, index) => {

    // if first item, send to main video
    if (index === 0){
      setMainVideo(item);
    }

    // setup li html with data
    const template = `
      <li>
        <a href="#" data-id="${item.id.videoId}" class="js-preview-btn">
          <div class="video-thumb">
            <div class="desc">${trimVideoDescription (item.snippet.title.toString(), 49)}</div>
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
        <a href="#" data-id="${item.id.videoId}" class="js-preview-btn">
          <div class="video-thumb">
            <div class="desc">${trimVideoDescription (item.snippet.title.toString(), 49)}</div>
            <div class="thumb"><img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title} image"></div>
          </div>
        </a>
      </li>
    `;

    // append li to ul
    $(`.js-${index}-list`).append(template);

  });

}

// populates main video content
function setMainVideo (videoObj) {
  console.log(videoObj);

  // set template
  const template = `
    <header><h4>${videoObj.snippet.title}</h4></header>
    <iframe width="700" height="394" src="https://www.youtube.com/embed/${videoObj.id.videoId}" frameborder="0" allowfullscreen></iframe>
    <h3>From: ${videoObj.snippet.channelTitle}</h3>
    <p>${videoObj.snippet.description}</p>
  `;

  $('.video-player').append(template);
}


// calls youtube API with search term and credentials
function callYouTubeAPI (q, callback) {

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

// force theme to be first part of search term
function forceThemedSearchTerm (q) {

  // concat theme in front of search term
  return `${theme}+${q}`;

}

// trim the video description for preview lists
function trimVideoDescription (description, trimAt) {
  return `${description.substring(0, trimAt)}...`;
}

$(initApp)
