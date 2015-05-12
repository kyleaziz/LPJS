'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wotask = mongoose.model('Wotask'),
	_ = require('lodash');

/**
 * Create a Wotask
 */
exports.create = function(req, res) {
	var wotask = new Wotask(req.body);
	wotask.user = req.user;
	wotask.workout = req.workoutplan; //Add workoutplan to the wotask

	wotask.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wotask);
		}
	});
};

/**
 * Show the current Wotask
 */
exports.read = function(req, res) {
	res.jsonp(req.wotask);
};

/**
 * Update a Wotask
 */
exports.update = function(req, res) {
	var wotask = req.wotask ;

	wotask = _.extend(wotask , req.body);

	wotask.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wotask);
		}
	});
};

/**
 * Delete an Wotask
 */
exports.delete = function(req, res) {
	var wotask = req.wotask ;

	wotask.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wotask);
		}
	});
};

/**
 * List of Wotasks
 */
exports.list = function(req, res) { 
	Wotask.find().sort('-created').populate('user', 'displayName').exec(function(err, wotasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wotasks);
		}
	});
};

/**
 * Wotask middleware
 */
exports.wotaskByID = function(req, res, next, id) { 
	Wotask.findById(id).populate('user', 'displayName').exec(function(err, wotask) {
		if (err) return next(err);
		if (! wotask) return next(new Error('Failed to load Wotask ' + id));
		req.wotask = wotask ;
		next();
	});
};

/**
 * Wotask authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wotask.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
