var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["English", "Español", "Français", "Unknown", "Other"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000','#7FFD1F','#EC872A', '#9527C2'];
  //intial data values
  $scope.supermanData = [0,0,0,0,0];
  $scope.batmanData = [0,0,0,0,0];

  socket.on('newTweet', function (tweet) {
    console.log(tweet.lang);
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    //parse source from payload
    var lang = tweet.lang
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })

    //check source and increment for #trump tweets
    if (hashtags.indexOf('superman') !== -1){
      switch (lang) {
        case 'en': $scope.supermanData[0]++
        break;
        case 'es': $scope.supermanData[1]++
        break;
        case 'fr': $scope.supermanData[2]++
        break;
        case 'und': $scope.supermanData[3]++
        break;
        default: $scope.supermanData[4]++
      }
    }

    //check source and increment for #feelthebern tweets
    else if (hashtags.indexOf('batman') !== -1) {
      switch (lang) {
        case 'en': $scope.batmanData[0]++
        break;
        case 'es': $scope.batmanData[1]++
        break;
        case 'fr': $scope.batmanData[2]++
        break;
        case 'und': $scope.batmanData[3]++
        break;
        default: $scope.batmanData[4]++
      }
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
