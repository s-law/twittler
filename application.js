$(document).ready(function() {
  var $didits = $('#didits');
  var $watched = $('#watched')
  var $toggleRefresh = $('#toggleRefresh');
  var $refreshDidits = $('#refreshDidits');
  var $toggleNight = $('#toggleNight');
  var users = [];
  var userSelect;

  var autorefresh = false;
  var nightmode = false;
  var diditAutoRefresh;

  function loadDidits(userSelected) {
    $didits.html('');
    var index = streams.home.length - 1;
    while(index >= 0) {
      var tweet = streams.home[index];
      var tweTime = tweet.created_at;
      var tweetElement = tweet.user +  '" title=\"' + tweTime + '\"></div>';

      if (userSelected && userSelected !== tweet.user) {
        tweetElement = 'hidden ' + tweetElement;
      }
      if (nightmode) {
        tweetElement = 'nightmode ' + tweetElement; 
      }
      
      tweetElement = '<div class="didit ' + tweetElement;
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
    $refreshDidits.toggleClass('hidden');
    if (!autorefresh) {
      autorefresh = true;
      $toggleRefresh.text('Auto-refresh: ON');
      diditAutoRefresh = setInterval(function() {
        loadDidits(userSelect);
      }, 15000);
    }
    else {
      autorefresh = false;
      $toggleRefresh.text('Auto-refresh: OFF');
      clearInterval(diditAutoRefresh);
    }
  });

  $refreshDidits.on('click', function() {
    loadDidits(userSelect);
  });

  $toggleNight.on('click', function() {
    $('body, aside, section, div.didit, div.didits, button, .watches').toggleClass('nightmode');
    if(!nightmode) {
      nightmode = true;
      $toggleNight.text('Night mode: ON');
    }
    else {
      nightmode = false;
      $toggleNight.text('Night mode: OFF');
    }
  });

  $('.watches').on('click', 'li', function() {
    userSelect = this.id;
    loadDidits(userSelect);
  });

});