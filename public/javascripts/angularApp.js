var app = angular.module('nicotinesKryptonite', ['ui.router']);

app.controller('HomeCtrl', [
	'$scope',
	'stories',
	function($scope, stories){
		// TODO: get these from the server
		$scope.homeStoryImage = "helloworld.jpg";
		$scope.homeStoryTitle = "Hello, World!";
		$scope.homeStorySummary = 
			"The origin of 'Hello, World!' came from Brian Kernighan. He wrote the first 'Hello, World!' " +
			"program as part of the documentation for the BCPL programming language developed by Martin Richards.";

		$scope.retrieveTopStory = function(){
			return stories.retrieveTopStory();
		};
	}
]);

app.factory('stories', [
	'$http',
	function($http){
		var service = {};

		service.retrieveTopStory = function(){
			// TODO
			return null;
		};

		return service;
	}
]);

/* FILTER FUNCTION COURTESY OF: stackoverflow user 'EpokK' */
app.filter('truncate', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});