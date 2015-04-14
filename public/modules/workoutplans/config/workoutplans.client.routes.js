'use strict';

//Setting up route
angular.module('workoutplans').config(['$stateProvider',
	function($stateProvider) {
		// Workoutplans state routing
		$stateProvider.
		state('listWorkoutplans', {
			url: '/workoutplans',
			templateUrl: 'modules/workoutplans/views/list-workoutplans.client.view.html'
		}).
		state('createWorkoutplan', {
			url: '/workoutplans/create',
			templateUrl: 'modules/workoutplans/views/create-workoutplan.client.view.html'
		}).
		state('viewWorkoutplan', {
			url: '/workoutplans/:workoutplanId',
			templateUrl: 'modules/workoutplans/views/view-workoutplan.client.view.html'
		}).
		state('editWorkoutplan', {
			url: '/workoutplans/:workoutplanId/edit',
			templateUrl: 'modules/workoutplans/views/edit-workoutplan.client.view.html'
		});
	}
]);