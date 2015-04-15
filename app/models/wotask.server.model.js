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
		required: 'Please fill Wotask name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	baseLift: {
		type: String,
		default: '',
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

mongoose.model('Wotask', WotaskSchema);