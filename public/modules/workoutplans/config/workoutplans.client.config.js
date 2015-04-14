'use strict';

// Configuring the Articles module
angular.module('workoutplans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Workouts', 'workoutplans', 'dropdown', '/workoutplans(/create)?');
		Menus.addSubMenuItem('topbar', 'workoutplans', 'List Workouts', 'workoutplans');
		Menus.addSubMenuItem('topbar', 'workoutplans', 'New Workout', 'workoutplans/create');
	}
]);