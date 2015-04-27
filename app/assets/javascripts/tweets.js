$(function() {
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

  var tweetSettings = {
    getURL: "/tweets/recent",
    templateSelector: "#tweet-template",
    containerSelector: "#tweets-container ul",
    loadingSnippet: "<li>Loading Tweets...</li>"
  }

  var renderTweet = _.template( $(tweetSettings.templateSelector).html() );
  var tweetsContainer = $( tweetSettings.containerSelector ).html( tweetSettings.loadingSnippet );

  var addTweet = function(tweet){
    tweetsContainer.prepend( renderTweet(tweet) );
  }

  var loadRecentTweets = function(){
    $.get(tweetSettings.getURL).done( function(list_of_tweets) {
        tweetsContainer.html("");
        _.each(list_of_tweets, addTweet);
    })
  };

  // Update Hashtags

  var addHashtag = function(hashtag) {
    if (hashtag.length > 0) {
      $( "#trends-container ul" ).prepend("<a href='/tweets/search/"+hashtag+"'><li> #"+hashtag+"</li></a>");
      $( "#trends-container ul li:last" ).remove();
    }
  };

  // BEGIN LOADING FUNCTIONS HERE

  // Load Recent Tweets

  loadRecentTweets();
  $("#brand").css({cursor: "pointer"});

  // Post New Tweet

  $(document).on("click", "#submit-tweet", function(post){
    post.preventDefault();

    createTweet = $.ajax({
      url: "/tweets",
      method: "POST",
    });

      // Animation for New Tweet

    createTweet.done(function(response) {
      $("#new-tweet").val("").end();
      addTweet(response);

        var firstTweet = $("#tweets-container ul li:first")
        var animateTweet = function() {
          firstTweet.css("display", "none");
          firstTweet.slideDown()
        };

      animateTweet();
      addHashtag(response.hashtag_names);
    });
  });

  // Search Function

  $(document).on("click", ".fa-search", function(post){
    post.preventDefault();

    searchHashtags = $.ajax({
      url: "/tweets/search/" + $("#search").val(),
      method: "GET",
    });

    searchHashtags.done(function(response) {
      $("#tweets-container h3").html("Tweets for #"+$("#search").val());
      $("#search").val("").css({background: "", opacity: ""}).end();
      tweetsContainer.html("");
      response.forEach(function(tweet) {
        addTweet(tweet)
      });
    });

    searchHashtags.fail(function() {
      $("#search").css({background: "red", opacity: "0.8"});
    });
  });

    // Link Hashtags to appear on river if clicked

  $(document).on("click", "#trends-container a", function(post){
    post.preventDefault();

    clickHashtags = $.ajax({
      url: this.href,
      method: "GET",
    });

    clickHashtags.done(function(response) {
      $("#tweets-container h3").html("Tweets for #" + this.url.substr(this.url.lastIndexOf('/') + 1));
      tweetsContainer.html("");
      response.forEach(function(tweet) {
        addTweet(tweet)
      });
    });
  });

  $(document).on("click", "#brand", function(){
     loadRecentTweets();
     $("#tweets-container h3").html("Tweets");
   });
});
