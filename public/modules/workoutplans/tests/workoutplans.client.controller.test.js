'use strict';

(function() {
	// Workoutplans Controller Spec
	describe('Workoutplans Controller Tests', function() {
		// Initialize global variables
		var WorkoutplansController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Workoutplans controller.
			WorkoutplansController = $controller('WorkoutplansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Workoutplan object fetched from XHR', inject(function(Workoutplans) {
			// Create sample Workoutplan using the Workoutplans service
			var sampleWorkoutplan = new Workoutplans({
				name: 'New Workoutplan'
			});

			// Create a sample Workoutplans array that includes the new Workoutplan
			var sampleWorkoutplans = [sampleWorkoutplan];

			// Set GET response
			$httpBackend.expectGET('workoutplans').respond(sampleWorkoutplans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workoutplans).toEqualData(sampleWorkoutplans);
		}));

		it('$scope.findOne() should create an array with one Workoutplan object fetched from XHR using a workoutplanId URL parameter', inject(function(Workoutplans) {
			// Define a sample Workoutplan object
			var sampleWorkoutplan = new Workoutplans({
				name: 'New Workoutplan'
			});

			// Set the URL parameter
			$stateParams.workoutplanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/workoutplans\/([0-9a-fA-F]{24})$/).respond(sampleWorkoutplan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workoutplan).toEqualData(sampleWorkoutplan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workoutplans) {
			// Create a sample Workoutplan object
			var sampleWorkoutplanPostData = new Workoutplans({
				name: 'New Workoutplan'
			});

			// Create a sample Workoutplan response
			var sampleWorkoutplanResponse = new Workoutplans({
				_id: '525cf20451979dea2c000001',
				name: 'New Workoutplan'
			});

			// Fixture mock form input values
			scope.name = 'New Workoutplan';

			// Set POST response
			$httpBackend.expectPOST('workoutplans', sampleWorkoutplanPostData).respond(sampleWorkoutplanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Workoutplan was created
			expect($location.path()).toBe('/workoutplans/' + sampleWorkoutplanResponse._id);
		}));

		it('$scope.update() should update a valid Workoutplan', inject(function(Workoutplans) {
			// Define a sample Workoutplan put data
			var sampleWorkoutplanPutData = new Workoutplans({
				_id: '525cf20451979dea2c000001',
				name: 'New Workoutplan'
			});

			// Mock Workoutplan in scope
			scope.workoutplan = sampleWorkoutplanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/workoutplans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/workoutplans/' + sampleWorkoutplanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workoutplanId and remove the Workoutplan from the scope', inject(function(Workoutplans) {
			// Create new Workoutplan object
			var sampleWorkoutplan = new Workoutplans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Workoutplans array and include the Workoutplan
			scope.workoutplans = [sampleWorkoutplan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/workoutplans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWorkoutplan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.workoutplans.length).toBe(0);
		}));
	});
}());