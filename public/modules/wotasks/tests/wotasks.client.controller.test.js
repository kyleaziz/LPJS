'use strict';

(function() {
	// Wotasks Controller Spec
	describe('Wotasks Controller Tests', function() {
		// Initialize global variables
		var WotasksController,
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

			// Initialize the Wotasks controller.
			WotasksController = $controller('WotasksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wotask object fetched from XHR', inject(function(Wotasks) {
			// Create sample Wotask using the Wotasks service
			var sampleWotask = new Wotasks({
				name: 'New Wotask'
			});

			// Create a sample Wotasks array that includes the new Wotask
			var sampleWotasks = [sampleWotask];

			// Set GET response
			$httpBackend.expectGET('wotasks').respond(sampleWotasks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wotasks).toEqualData(sampleWotasks);
		}));

		it('$scope.findOne() should create an array with one Wotask object fetched from XHR using a wotaskId URL parameter', inject(function(Wotasks) {
			// Define a sample Wotask object
			var sampleWotask = new Wotasks({
				name: 'New Wotask'
			});

			// Set the URL parameter
			$stateParams.wotaskId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wotasks\/([0-9a-fA-F]{24})$/).respond(sampleWotask);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wotask).toEqualData(sampleWotask);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wotasks) {
			// Create a sample Wotask object
			var sampleWotaskPostData = new Wotasks({
				name: 'New Wotask'
			});

			// Create a sample Wotask response
			var sampleWotaskResponse = new Wotasks({
				_id: '525cf20451979dea2c000001',
				name: 'New Wotask'
			});

			// Fixture mock form input values
			scope.name = 'New Wotask';

			// Set POST response
			$httpBackend.expectPOST('wotasks', sampleWotaskPostData).respond(sampleWotaskResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wotask was created
			expect($location.path()).toBe('/wotasks/' + sampleWotaskResponse._id);
		}));

		it('$scope.update() should update a valid Wotask', inject(function(Wotasks) {
			// Define a sample Wotask put data
			var sampleWotaskPutData = new Wotasks({
				_id: '525cf20451979dea2c000001',
				name: 'New Wotask'
			});

			// Mock Wotask in scope
			scope.wotask = sampleWotaskPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wotasks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wotasks/' + sampleWotaskPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wotaskId and remove the Wotask from the scope', inject(function(Wotasks) {
			// Create new Wotask object
			var sampleWotask = new Wotasks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wotasks array and include the Wotask
			scope.wotasks = [sampleWotask];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wotasks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWotask);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wotasks.length).toBe(0);
		}));
	});
}());