$(document).ready(function() {
  var $didits = $('#didits');
  var $watched = $('#watched')
  var $toggleRefresh = $('#toggleRefresh');
  var users = [];

  var autorefresh = false;
  var diditAutoRefresh;

  function loadDidits() {
    $didits.html('');
    var index = streams.home.length - 1;
    while(index >= 0) {
      var tweet = streams.home[index];
      var tweTime = tweet.created_at;
      var tweetElement = '<div class="didit ' + tweet.user +  '" title=\"' + tweTime + '\"></div>'
      var tweetFormatted = '@' + tweet.user + ':<br />' + tweet.message + '<br /><span class="diditByline">' + $.timeago(tweTime) + '</span>';

      var $tweet = $(tweetElement);
      $tweet.html(tweetFormatted);
      $tweet.appendTo($didits);
      index -= 1;
    }
  }

  function loadWatched () {
    for(var name in streams.users) {
      users.push(name);
    }
    users = users.sort();

    $watched.html('');
    users.forEach(function(user) {
      var userElement = '<li id=\"' + user + '\"></li>'

      var $user = $(userElement);
      $user.html(user);
      $user.appendTo($watched);
    });
  }

  loadDidits();
  loadWatched();

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