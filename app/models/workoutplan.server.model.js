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
		required: 'Please fill Workout name',
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
		default: 'lift',
		trim: true
}});

// Two properties here for the same functionality. Started with tasks as an array of detailed objects that needed to be completed. 
// Added the subTasks type that references tasks as their own objects and collection in the database.
WorkoutplanSchema.add({tasks: [
]});

WorkoutplanSchema.add({
	subTasks: [{type: Schema.ObjectId, ref: 'woTasks'}]
});

WorkoutplanSchema.add({woDate: {
		type: Date,
		required: 'You didn\'t specify a date'
}});

WorkoutplanSchema.add({phase: {
		type: String,
		trim: true,
		required: 'No phase was given'
}});

WorkoutplanSchema.add({program: {
		type: String,
		trim: true//,
		//required: 'This workout needs to be part of a program. Please choose one.'
	}});

mongoose.model('Workoutplan', WorkoutplanSchema);