$(document).ready(function() {
  var $didits = $('#didits');
  var $toggleRefresh = $('#toggleRefresh');

  var autorefresh = false;
  var diditAutoRefresh;

  function loadDidits() {
    $didits.html('');
    var index = streams.home.length - 1;
    while(index >= 0) {
      var tweet = streams.home[index];
      var tweTime = tweet.created_at;
      var tweetElement = '<div class="didit" title=\"' + tweTime + '\"></div>'
      var tweetFormatted = '@' + tweet.user + '<br />' + tweet.message + '<br /><span class="diditByline">' + tweet.user + ' didIt ' + $.timeago(tweTime) + '</span>';

      var $tweet = $(tweetElement);
      $tweet.html(tweetFormatted);
      $tweet.appendTo($didits);
      index -= 1;
    }
  }

  loadDidits();

  $toggleRefresh.on('click', function() {
    $('#refreshDidits').slideToggle();
    if (!autorefresh) {
      autorefresh = true;
      $toggleRefresh.text('Auto-refresh: ON');
      diditAutoRefresh = setInterval(loadDidits, 30000);
    }
    else {
      autorefresh = false;
      $toggleRefresh.text('Auto-refresh: OFF');
      clearInterval(diditAutoRefresh);
    }
  })

  $('#refreshDidits').on('click', function() {
    loadDidits();
  })

});