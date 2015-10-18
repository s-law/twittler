$(document).ready(function() {
  var $didits = $('#didits');
  var $watched = $('#watched')
  var $toggleRefresh = $('#toggleRefresh');
  var $refreshDidits = $('#refreshDidits');
  var $resumeDidits = $('#resumeDidits');
  var $toggleNight = $('#toggleNight');
  
  var users = [];
  var userSelect;
  var autoRefreshFlag = false;
  var nightModeFlag = false;
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
      if (nightModeFlag) {
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

  function loadWatched() {
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

  function filterHelper(userSelect) {
    $refreshDidits.text('Load new didIts from ' + userSelect);
    $('#whoseDidits').html('<h3>Currently viewing: ' + userSelect + '\'s didIts').removeClass('hidden');
    loadDidits(userSelect);
  }

  loadDidits();
  loadWatched();

  // event handler for auto-refresh toggle. refresh interval of 15 seconds.
  $toggleRefresh.on('click', function() {
    $refreshDidits.toggleClass('hidden');
    if (!autoRefreshFlag) {
      autoRefreshFlag = true;
      $toggleRefresh.text('Auto-refresh: ON');
      $toggleRefresh.prop('title', 'I can load didIts on my own, tyvm');
      diditAutoRefresh = setInterval(function() {
        loadDidits(userSelect);
      }, 15000);
    }
    else {
      autoRefreshFlag = false;
      $toggleRefresh.text('Auto-refresh: OFF');
      $toggleRefresh.prop('title', 'Clicking to load new didIts is tiring');
      clearInterval(diditAutoRefresh);
    }
  });

  // event handler for manual refresh of stream
  $refreshDidits.on('click', function() {
    loadDidits(userSelect);
  });

  // event handler for night mode toggle
  $toggleNight.on('click', function() {
    $('body, aside, section, div.didit, div.didits, button, .watches').toggleClass('nightmode');
    if(!nightModeFlag) {
      nightModeFlag = true;
      $toggleNight.text('Night mode: ON');
      $toggleNight.prop('title', 'Make reading didIts more painful at night');
    }
    else {
      nightModeFlag = false;
      $toggleNight.text('Night mode: OFF');
      $toggleNight.prop('title', 'Make reading didIts less painful at night');
    }
  });

  // event handler for username filtering by watcher panel
  $('.watches').on('click', 'li', function() {
    $resumeDidits.removeClass('hidden');
    userSelect = this.id;
    filterHelper(userSelect);
  });

  // event handler for username filtering by didit
  $('#didits').on('click', '.didit', function() {
    $resumeDidits.removeClass('hidden');
    var classNames = this.className.split(' ');
    userSelect = classNames[classNames.length - 1];
    filterHelper(userSelect);
  });

  // event handler for termination of username filtering
  $resumeDidits.on('click', function() {
    userSelect = undefined;
    $('#resumeDidits, #whoseDidits').addClass('hidden');
    $refreshDidits.text('Load new didIts');
    loadDidits();
  });

  // event handler for jumping to the top of the page
  $('#goTop').on('click', function() {
    $('body').animate({scrollTop: 0 }, '100');
  });

});