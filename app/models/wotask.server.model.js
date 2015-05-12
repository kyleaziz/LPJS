'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wotask Schema
 */
var WotaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in a Task name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	baseLift: {
		type: String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	reps: {
		type: Number
	},
	sets: {
		type: Number
	},
	style: {
		type: String,
		default: 'Percent'
	},
	percent: {
		type: Number
	},
	workout: {
		type: Schema.ObjectId, ref: 'Workoutplan'
	}

});

mongoose.model('Wotask', WotaskSchema);