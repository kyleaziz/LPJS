'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workoutplan Schema
 */
var WorkoutplanSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Workout Plan name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

WorkoutplanSchema.add({description: {
		type: String,
		default: '',
		trim: true
	}});

WorkoutplanSchema.add({tasks: [{
		type: String,
		default: '',
		trim: true
	}]});

mongoose.model('Workoutplan', WorkoutplanSchema);