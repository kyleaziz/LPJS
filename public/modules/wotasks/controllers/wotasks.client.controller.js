'use strict';

// Wotasks controller
angular.module('wotasks').controller('WotasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wotasks',
	function($scope, $stateParams, $location, Authentication, Wotasks) {
		$scope.authentication = Authentication;

		// Create new Wotask
		$scope.create = function() {
			// Create new Wotask object
			var wotask = new Wotasks ({
				name: this.name
			});

			// Redirect after save
			wotask.$save(function(response) {
				$location.path('wotasks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wotask
		$scope.remove = function(wotask) {
			if ( wotask ) { 
				wotask.$remove();

				for (var i in $scope.wotasks) {
					if ($scope.wotasks [i] === wotask) {
						$scope.wotasks.splice(i, 1);
					}
				}
			} else {
				$scope.wotask.$remove(function() {
					$location.path('wotasks');
				});
			}
		};

		// Update existing Wotask
		$scope.update = function() {
			var wotask = $scope.wotask;

			wotask.$update(function() {
				$location.path('wotasks/' + wotask._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wotasks
		$scope.find = function() {
			$scope.wotasks = Wotasks.query();
		};

		// Find existing Wotask
		$scope.findOne = function() {
			$scope.wotask = Wotasks.get({ 
				wotaskId: $stateParams.wotaskId
			});
		};
	}
]);