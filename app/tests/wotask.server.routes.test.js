'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wotask = mongoose.model('Wotask'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wotask;

/**
 * Wotask routes tests
 */
describe('Wotask CRUD tests', function() {
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

		// Save a user to the test db and create new Wotask
		user.save(function() {
			wotask = {
				name: 'Wotask Name'
			};

			done();
		});
	});

	it('should be able to save Wotask instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wotask
				agent.post('/wotasks')
					.send(wotask)
					.expect(200)
					.end(function(wotaskSaveErr, wotaskSaveRes) {
						// Handle Wotask save error
						if (wotaskSaveErr) done(wotaskSaveErr);

						// Get a list of Wotasks
						agent.get('/wotasks')
							.end(function(wotasksGetErr, wotasksGetRes) {
								// Handle Wotask save error
								if (wotasksGetErr) done(wotasksGetErr);

								// Get Wotasks list
								var wotasks = wotasksGetRes.body;

								// Set assertions
								(wotasks[0].user._id).should.equal(userId);
								(wotasks[0].name).should.match('Wotask Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wotask instance if not logged in', function(done) {
		agent.post('/wotasks')
			.send(wotask)
			.expect(401)
			.end(function(wotaskSaveErr, wotaskSaveRes) {
				// Call the assertion callback
				done(wotaskSaveErr);
			});
	});

	it('should not be able to save Wotask instance if no name is provided', function(done) {
		// Invalidate name field
		wotask.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wotask
				agent.post('/wotasks')
					.send(wotask)
					.expect(400)
					.end(function(wotaskSaveErr, wotaskSaveRes) {
						// Set message assertion
						(wotaskSaveRes.body.message).should.match('Please fill Wotask name');
						
						// Handle Wotask save error
						done(wotaskSaveErr);
					});
			});
	});

	it('should be able to update Wotask instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wotask
				agent.post('/wotasks')
					.send(wotask)
					.expect(200)
					.end(function(wotaskSaveErr, wotaskSaveRes) {
						// Handle Wotask save error
						if (wotaskSaveErr) done(wotaskSaveErr);

						// Update Wotask name
						wotask.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wotask
						agent.put('/wotasks/' + wotaskSaveRes.body._id)
							.send(wotask)
							.expect(200)
							.end(function(wotaskUpdateErr, wotaskUpdateRes) {
								// Handle Wotask update error
								if (wotaskUpdateErr) done(wotaskUpdateErr);

								// Set assertions
								(wotaskUpdateRes.body._id).should.equal(wotaskSaveRes.body._id);
								(wotaskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wotasks if not signed in', function(done) {
		// Create new Wotask model instance
		var wotaskObj = new Wotask(wotask);

		// Save the Wotask
		wotaskObj.save(function() {
			// Request Wotasks
			request(app).get('/wotasks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wotask if not signed in', function(done) {
		// Create new Wotask model instance
		var wotaskObj = new Wotask(wotask);

		// Save the Wotask
		wotaskObj.save(function() {
			request(app).get('/wotasks/' + wotaskObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wotask.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wotask instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wotask
				agent.post('/wotasks')
					.send(wotask)
					.expect(200)
					.end(function(wotaskSaveErr, wotaskSaveRes) {
						// Handle Wotask save error
						if (wotaskSaveErr) done(wotaskSaveErr);

						// Delete existing Wotask
						agent.delete('/wotasks/' + wotaskSaveRes.body._id)
							.send(wotask)
							.expect(200)
							.end(function(wotaskDeleteErr, wotaskDeleteRes) {
								// Handle Wotask error error
								if (wotaskDeleteErr) done(wotaskDeleteErr);

								// Set assertions
								(wotaskDeleteRes.body._id).should.equal(wotaskSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wotask instance if not signed in', function(done) {
		// Set Wotask user 
		wotask.user = user;

		// Create new Wotask model instance
		var wotaskObj = new Wotask(wotask);

		// Save the Wotask
		wotaskObj.save(function() {
			// Try deleting Wotask
			request(app).delete('/wotasks/' + wotaskObj._id)
			.expect(401)
			.end(function(wotaskDeleteErr, wotaskDeleteRes) {
				// Set message assertion
				(wotaskDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wotask error error
				done(wotaskDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wotask.remove().exec();
		done();
	});
});