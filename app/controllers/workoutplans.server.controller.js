'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Workoutplan = mongoose.model('Workoutplan'),
	_ = require('lodash');

/**
 * Create a Workoutplan
 */
exports.create = function(req, res) {
	var workoutplan = new Workoutplan(req.body);
	workoutplan.user = req.user;

	workoutplan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workoutplan);
		}
	});
};

/**
 * Show the current Workoutplan
 */
exports.read = function(req, res) {
	res.jsonp(req.workoutplan);
};

/**
 * Update a Workoutplan
 */
exports.update = function(req, res) {
	var workoutplan = req.workoutplan ;

	workoutplan = _.extend(workoutplan , req.body);

	workoutplan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workoutplan);
		}
	});
};

/**
 * Delete an Workoutplan
 */
exports.delete = function(req, res) {
	var workoutplan = req.workoutplan ;

	workoutplan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workoutplan);
		}
	});
};

/**
 * List of Workoutplans
 */
exports.list = function(req, res) { 
	Workoutplan.find().sort('-created').populate('user', 'displayName').exec(function(err, workoutplans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workoutplans);
		}
	});
};

/**
 * Workoutplan middleware
 */
exports.workoutplanByID = function(req, res, next, id) { 
	Workoutplan.findById(id).populate('user', 'displayName').exec(function(err, workoutplan) {
		if (err) return next(err);
		if (! workoutplan) return next(new Error('Failed to load Workoutplan ' + id));
		req.workoutplan = workoutplan ;
		next();
	});
};

/**
 * Workoutplan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.workoutplan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
