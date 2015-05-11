var SECONDS_PER_DEATH = 5.35;
var MILLIS_PER_SECOND = 1000;
var DEATH_UPDATE_INTERVAL = 10000;
var EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
	'auth',
	'signup',
	function($scope, $interval, stories, auth, signup){
		$scope.deathToll = 0;
		var topStory = stories.topStory;
		$scope.homeStoryImageUri = topStory.imageUri;
		$scope.homeStoryTitle = topStory.title;
		$scope.homeStorySummary = topStory.summary;
		$scope.readMoreURL = "/stories/" + topStory._id;

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

app.controller('DashboardCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
		$scope.dashboard = auth.dashboard;
	}
]);

app.controller('SignupCtrl', [
	'$scope',
	'$state',
	'auth',
	'signup',
	function($scope, $state, auth, signup){
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
			}
			else {
				auth.register($scope.user).error(function(error){
					$scope.registrationErrors.push(error);
				}).then(function(){
					$state.go('home');
				});
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
	'$state',
	'auth',
	'signup',
	function($scope, $state, auth, signup){
		$scope.beginSignup = function(){
			signup.beginSignup();
		};

		$scope.user = {};
		$scope.errors = [];

		$scope.isEmailAddress = function(text){
			return EMAIL_REGEX.test(text);
		};

		$scope.logIn = function(){
			$scope.toggleModal();
			$scope.errors = [];

			auth.logIn($scope.user).error(function(error){
				$scope.errors.push(error.message);
			}).then(function(){
				//$scope.isLoggingIn = false;
				$scope.setActive('dashboardLink');
				$state.go('dashboard');
			});
		};
		$scope.logout = function(){
			auth.logOut();
		};

		$scope.showModal = false;
		$scope.toggleModal = function(){
			$scope.showModal = !$scope.showModal;
		};

		$scope.isLoggedIn = function(){
			return auth.isLoggedIn();
		};

		$scope.setActive = function(element_id){
			var classList = document.getElementById(element_id).classList;
			var userActiveElement = document.getElementsByClassName("userLinkActive")[0];
			var activeElement = document.getElementsByClassName("active")[0];

			if (userActiveElement){
				userActiveElement.classList.remove("userLinkActive");
			}
			if (activeElement){
				activeElement.classList.remove("active");
			}

			if (classList.contains("userLink")){
				classList.add("userLinkActive");
			}
			else {
				classList.add("active");
			}
		};
	}
]);

app.directive('modal', function(){
	return {
		template: '<div class="modal fade">' +
			'<div class="modal-dialog">' +
				'<div class="modal-content">' +
					'<div class="modal-header">' +
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
						'<h4 class="modal-title">{{ title }}</h4>'  +
					'</div>' +
					'<div class="modal-body" ng-transclude></div>' +
				'</div>' +
			'</div>' +
		'</div>',
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: true,
		link: function postLink(scope, element, attrs) {
			scope.title = attrs.title;

			scope.$watch(attrs.visible, function(value){
				if (value){
					$(element).modal('show');
				}
				else {
					$(element).modal('hide');
				}
			});

			$(element).on('shown.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = true;
				});
			});
			$(element).on('hidden.bs.modal', function(){
				scope.$apply(function(){
					scope.$parent[attrs.visible] = false;
				});
			});
		}
	};
});

app.controller('StoriesCtrl', [
	'$scope',
	'$sce',
	'story',
	function($scope, $sce, story){
		$scope.story = story;
		$scope.storyText = $sce.trustAsResourceUrl(story.storyUri);
	}
]);

app.factory('stories', [
	'$http',
	function($http){
		var service = {
			topStory: {}
		};

		service.retrieveTopStory = function(){
			return $http.get('/topStory').success(function(data){
				angular.copy(data.story, service.topStory);
			});
		};
		service.get = function(id){
			return $http.get('/stories/' + id).then(function(response){
				return response.data;
			});
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

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {
		dashboard: {}
	};

	auth.saveToken = function(token){
		$window.localStorage['nicotines-kryptonite-token'] = token;
	};
	auth.getToken = function(){
		return $window.localStorage['nicotines-kryptonite-token'];
	};
	auth.isLoggedIn = function(){
		var token = auth.getToken();
		var isAuthenticated = false;

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			isAuthenticated = payload.exp > Date.now() / 1000;
		}

		return isAuthenticated;
	};
	// OMITTED currentUser function: don't think I need it
	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	auth.logIn = function(user){
		return $http.post('/dashboard', user).success(function(data){
			auth.saveToken(data.token);
			//alert('the dash: ' + data.dashboard.greeting);
			auth.dashboard = data.dashboard;
			//$window.localStorage['dashboard'] = data.dashboard;
		});
	};
	auth.logOut = function(){
		$window.localStorage.removeItem('nicotines-kryptonite-token');
	};

	return auth;
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'HomeCtrl',
			resolve: {
				storyPromise: ['stories', function(stories){
					return stories.retrieveTopStory();
				}]
			}
		});
		$stateProvider.state('signup', {
			url: '/signup',
			templateUrl: '/signup.html',
			controller: 'SignupCtrl'
		});
		$stateProvider.state('viewStory', {
			url: '/stories/{id}',
			templateUrl: '/viewStory.html',
			controller: 'StoriesCtrl',
			resolve: {
				story: ['$stateParams', 'stories', function($stateParams, stories){
					return stories.get($stateParams.id);
				}]
			}
		});
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			templateUrl: '/dashboard.html',
			controller: 'DashboardCtrl',
			resolve: {
				dashboard: ['$stateParams', function($stateParams){
					return null;// D-<==>}}D:
				}]
			}
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