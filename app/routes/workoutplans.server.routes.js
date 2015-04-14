'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var workoutplans = require('../../app/controllers/workoutplans.server.controller');

	// Workoutplans Routes
	app.route('/workoutplans')
		.get(workoutplans.list)
		.post(users.requiresLogin, workoutplans.create);

	app.route('/workoutplans/:workoutplanId')
		.get(workoutplans.read)
		.put(users.requiresLogin, workoutplans.hasAuthorization, workoutplans.update)
		.delete(users.requiresLogin, workoutplans.hasAuthorization, workoutplans.delete);

	// Finish by binding the Workoutplan middleware
	app.param('workoutplanId', workoutplans.workoutplanByID);
};
