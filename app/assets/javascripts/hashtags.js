$(function() {

  var hashtagSettings = {
    getURL: "/hashtags/popular",
    containerSelector: "#trends-container ul",
    loadingSnippet: "<li>Loading Hashtags...</li>"
  }

  var renderHashtag = function(hashtag) { return "<a href='/tweets/search/"+hashtag+"'><li> #"+hashtag+"</li></a>" };
  var hashtagContainer = $( hashtagSettings.containerSelector ).html( hashtagSettings.loadingSnippet );

  var addHashtag = function(hashtag){
    hashtagContainer.append( renderHashtag(hashtag) );
  }

  var loadRecentHashtags = function(){
    $.get(hashtagSettings.getURL).done( function(list_of_hashtags) {
        hashtagContainer.html("");
        _.each(list_of_hashtags, addHashtag);
    })
  };

  // Load Recent Hashtags

  loadRecentHashtags();

})
