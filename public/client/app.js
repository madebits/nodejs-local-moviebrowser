var app = angular.module('movieApp', []);

app.constant('partialViewUrl', '/app/view?name=')
    .controller('movieCtrl', function($scope, $http, $window, partialViewUrl){
    $scope.data = {};

    $http.get('/?json=1').success(function(data, status, headers, config){
        $scope.data = data;
        $scope.data.stopVisible = true;
    })
    .error(function(data, status, headers, config){
        onError();
    });

    $scope.movie = function(row, col) {
        var idx = row * $scope.data.cols + col;
        if(idx >= $scope.data.movies.length) return null;
        return $scope.data.movies[idx];
    };

    $scope.range = function(min, max){
        var range = [];
        for(var i = min; i < max; i++) {
              range.push(i);
        }
        return range;
    };

    $scope.playMovie = function(url) {
        $http.get(url)
            .error(function(){
                onError()
            });
        return false;
    };

    $scope.stop = function() {
        $http.get('/close')
            .error(function(){
                onError()
            });
        return false;
    };

    var onError = function() {
        $window.alert("Stopped!");
        $scope.data.stopVisible = false;
        $window.open(location, "_self").close();
    };

    $scope.resolvePartial = function(partialName) {
        return partialViewUrl + escape(partialName);
    };
});

