'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Workoutplan = mongoose.model('Workoutplan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, workoutplan;

/**
 * Workoutplan routes tests
 */
describe('Workoutplan CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Workoutplan
		user.save(function() {
			workoutplan = {
				name: 'Workoutplan Name'
			};

			done();
		});
	});

	it('should be able to save Workoutplan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workoutplan
				agent.post('/workoutplans')
					.send(workoutplan)
					.expect(200)
					.end(function(workoutplanSaveErr, workoutplanSaveRes) {
						// Handle Workoutplan save error
						if (workoutplanSaveErr) done(workoutplanSaveErr);

						// Get a list of Workoutplans
						agent.get('/workoutplans')
							.end(function(workoutplansGetErr, workoutplansGetRes) {
								// Handle Workoutplan save error
								if (workoutplansGetErr) done(workoutplansGetErr);

								// Get Workoutplans list
								var workoutplans = workoutplansGetRes.body;

								// Set assertions
								(workoutplans[0].user._id).should.equal(userId);
								(workoutplans[0].name).should.match('Workoutplan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Workoutplan instance if not logged in', function(done) {
		agent.post('/workoutplans')
			.send(workoutplan)
			.expect(401)
			.end(function(workoutplanSaveErr, workoutplanSaveRes) {
				// Call the assertion callback
				done(workoutplanSaveErr);
			});
	});

	it('should not be able to save Workoutplan instance if no name is provided', function(done) {
		// Invalidate name field
		workoutplan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workoutplan
				agent.post('/workoutplans')
					.send(workoutplan)
					.expect(400)
					.end(function(workoutplanSaveErr, workoutplanSaveRes) {
						// Set message assertion
						(workoutplanSaveRes.body.message).should.match('Please fill Workoutplan name');
						
						// Handle Workoutplan save error
						done(workoutplanSaveErr);
					});
			});
	});

	it('should be able to update Workoutplan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workoutplan
				agent.post('/workoutplans')
					.send(workoutplan)
					.expect(200)
					.end(function(workoutplanSaveErr, workoutplanSaveRes) {
						// Handle Workoutplan save error
						if (workoutplanSaveErr) done(workoutplanSaveErr);

						// Update Workoutplan name
						workoutplan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Workoutplan
						agent.put('/workoutplans/' + workoutplanSaveRes.body._id)
							.send(workoutplan)
							.expect(200)
							.end(function(workoutplanUpdateErr, workoutplanUpdateRes) {
								// Handle Workoutplan update error
								if (workoutplanUpdateErr) done(workoutplanUpdateErr);

								// Set assertions
								(workoutplanUpdateRes.body._id).should.equal(workoutplanSaveRes.body._id);
								(workoutplanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Workoutplans if not signed in', function(done) {
		// Create new Workoutplan model instance
		var workoutplanObj = new Workoutplan(workoutplan);

		// Save the Workoutplan
		workoutplanObj.save(function() {
			// Request Workoutplans
			request(app).get('/workoutplans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Workoutplan if not signed in', function(done) {
		// Create new Workoutplan model instance
		var workoutplanObj = new Workoutplan(workoutplan);

		// Save the Workoutplan
		workoutplanObj.save(function() {
			request(app).get('/workoutplans/' + workoutplanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', workoutplan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Workoutplan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workoutplan
				agent.post('/workoutplans')
					.send(workoutplan)
					.expect(200)
					.end(function(workoutplanSaveErr, workoutplanSaveRes) {
						// Handle Workoutplan save error
						if (workoutplanSaveErr) done(workoutplanSaveErr);

						// Delete existing Workoutplan
						agent.delete('/workoutplans/' + workoutplanSaveRes.body._id)
							.send(workoutplan)
							.expect(200)
							.end(function(workoutplanDeleteErr, workoutplanDeleteRes) {
								// Handle Workoutplan error error
								if (workoutplanDeleteErr) done(workoutplanDeleteErr);

								// Set assertions
								(workoutplanDeleteRes.body._id).should.equal(workoutplanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Workoutplan instance if not signed in', function(done) {
		// Set Workoutplan user 
		workoutplan.user = user;

		// Create new Workoutplan model instance
		var workoutplanObj = new Workoutplan(workoutplan);

		// Save the Workoutplan
		workoutplanObj.save(function() {
			// Try deleting Workoutplan
			request(app).delete('/workoutplans/' + workoutplanObj._id)
			.expect(401)
			.end(function(workoutplanDeleteErr, workoutplanDeleteRes) {
				// Set message assertion
				(workoutplanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Workoutplan error error
				done(workoutplanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Workoutplan.remove().exec();
		done();
	});
});