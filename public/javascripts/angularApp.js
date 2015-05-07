var SECONDS_PER_DEATH = 5.35;
var MILLIS_PER_SECOND = 1000;
var DEATH_UPDATE_INTERVAL = 10000;

//--- HELPER FUNCTIONS ---//
function populateStates(){
	var statesList = [
			'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'D.C.', 'DE', 'FL',
			'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
			'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
			'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
			'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
			'VA', 'WA', 'WV', 'WI', 'WY', 'Puerto Rico', 'American Samoa',
			'Guam', 'Northern Mariana Islands', 'U.S. Virgin Islands',
			'Outside the U.S.'
	];

	var stateSelect = document.getElementById('stateSelect');

	for (var i = 0; i < statesList.length; i++){
		state = statesList[i];
		var option = document.createElement("option");
		option.value = state;
		option.innerHTML = state;
		
		stateSelect.appendChild(option);
	}
}

function populateCigaretteBrands(){
	var cigaretteBrands = [
		'Marlboro', 'Camel', 'L&M', 'Newport', 'Dunhill',
		'Pall Mall', 'Winston', 'Parliament'
	];

	var cigSelect = document.getElementById('cigaretteBrands');

	for (var i = 0; i < cigaretteBrands.length; i++){
		brand = cigaretteBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigSelect.appendChild(option);
	}
}

function populateSmokelessBrands(){
	var smokelessBrands = [
		'Copenhagen', 'Skoal', 'Husky', 'Grizzly', 'Kodiak',
		'Red Man', 'Levi Garrett', 'Longhorn', 'Marlboro',
		'Camel', 'Lucky Strike', 'Knox'
	];

	var smokelessSelect = document.getElementById('smokelessBrands');

	for (var i = 0; i < smokelessBrands.length; i++){
		brand = smokelessBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		smokelessSelect.appendChild(option);
	}
}

function populateCigarBrands(){
	var cigarBrands = [
		'ACID', 'Macanudo', 'H. Upmann', 'Ashton', 'Montecristo',
		'Romeo y Julieta', 'Padron'
	];

	var cigarSelect = document.getElementById('cigarBrands');

	for (var i = 0; i < cigarBrands.length; i++){
		brand = cigarBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigarSelect.appendChild(option);
	}
}


//--- ANGULAR APP CONSTRUCTION ---//
var app = angular.module('nicotinesKryptonite', ['ui.router']);

app.controller('HomeCtrl', [
	'$scope',
	'$interval',
	'stories',
	'signup',
	function($scope, $interval, stories, signup){
		// TODO: get these from the server
		$scope.homeStoryImage = "helloworld.jpg";
		$scope.homeStoryTitle = "Hello, World!";
		$scope.homeStorySummary = 
			"The origin of 'Hello, World!' came from Brian Kernighan. He wrote the first 'Hello, World!' " +
			"program as part of the documentation for the BCPL programming language developed by Martin Richards.";
		$scope.deathToll = 0;

		$scope.retrieveTopStory = function(){
			return stories.retrieveTopStory();
		};

		$scope.numberWithCommas = function(x) {
		    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};
		$scope.updateDeathToll = function(){
			var currentYear = new Date().getFullYear();
			var startOfYear = new Date(currentYear, 1, 1);
			var secondsThisYear = Math.abs(new Date() - startOfYear) / MILLIS_PER_SECOND;

			var deathsThisYear = secondsThisYear / SECONDS_PER_DEATH;

			$scope.deathToll = $scope.numberWithCommas(Math.floor(deathsThisYear)) + " deaths from tobacco this year.";
		};

		$scope.updateDeathToll();
		$interval($scope.updateDeathToll, DEATH_UPDATE_INTERVAL);
	}
]);

app.controller('SignupCtrl', [
	'$scope',
	'signup',
	function($scope, signup){
		// TODO: Get dropdown arrays from server
		populateStates();
		populateCigaretteBrands();
		populateSmokelessBrands();
		populateCigarBrands();

		$scope.registrationErrors = [];

		$scope.tobaccoTypes = ['Cigarettes', 'Smokeless Tobacco', 'Cigars'];
		$scope.user = {
			selectedTobaccoTypes: []
		};

		$scope.toggleTobaccoSelection = function(tobaccoType){
			var index = $scope.user.selectedTobaccoTypes.indexOf(tobaccoType);

			if (index > -1){
				$scope.user.selectedTobaccoTypes.splice(index, 1);
			}
			else {
				$scope.user.selectedTobaccoTypes.push(tobaccoType);
			}
		};
		$scope.register = function(){
			if ($scope.user.password !== $scope.user.passwordConfirmation){
				$scope.registrationErrors.push('Password and confirmation do not match');
				$scope.registrationErrors.push('This is totally a test error message for styling purposes');
			}
		};
		$scope.getSignupPage = function(){
			return signup.getSignupPage();
		};
		$scope.goNextPage = function(pageTitle){
			$scope.registrationErrors = [];
			signup.goNextPage(pageTitle);
		};
	}
]);

app.controller('NavCtrl', [
	'$scope',
	'signup',
	function($scope, signup){
		$scope.beginSignup = function(){
			signup.beginSignup();
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

app.factory('signup', [
	function(){
		var service = { currentSignupPage: 'None'
		};

		service.getSignupPage = function(){
			return currentSignupPage;
		};
		service.goNextPage = function(pageTitle){
			currentSignupPage = pageTitle;
		};
		service.beginSignup = function(){
			currentSignupPage = 'Intro';
		};

		return service;
	}
]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'HomeCtrl'
		});

		$stateProvider.state('signup', {
			url: '/signup',
			templateUrl: '/signup.html',
			controller: 'SignupCtrl'
		});

		$urlRouterProvider.otherwise('home');
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