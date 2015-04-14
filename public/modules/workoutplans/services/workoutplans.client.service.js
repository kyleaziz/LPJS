'use strict';

//Workoutplans service used to communicate Workoutplans REST endpoints
angular.module('workoutplans').factory('Workoutplans', ['$resource',
	function($resource) {
		return $resource('workoutplans/:workoutplanId', { workoutplanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);