'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wotasks = require('../../app/controllers/wotasks.server.controller');

	// Wotasks Routes
	app.route('/wotasks')
		.get(wotasks.list)
		.post(users.requiresLogin, wotasks.create);

	app.route('/wotasks/:wotaskId')
		.get(wotasks.read)
		.put(users.requiresLogin, wotasks.hasAuthorization, wotasks.update)
		.delete(users.requiresLogin, wotasks.hasAuthorization, wotasks.delete);

	// Finish by binding the Wotask middleware
	app.param('wotaskId', wotasks.wotaskByID);
};
