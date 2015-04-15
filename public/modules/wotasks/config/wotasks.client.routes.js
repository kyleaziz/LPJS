'use strict';

//Setting up route
angular.module('wotasks').config(['$stateProvider',
	function($stateProvider) {
		// Wotasks state routing
		$stateProvider.
		state('listWotasks', {
			url: '/wotasks',
			templateUrl: 'modules/wotasks/views/list-wotasks.client.view.html'
		}).
		state('createWotask', {
			url: '/wotasks/create',
			templateUrl: 'modules/wotasks/views/create-wotask.client.view.html'
		}).
		state('viewWotask', {
			url: '/wotasks/:wotaskId',
			templateUrl: 'modules/wotasks/views/view-wotask.client.view.html'
		}).
		state('editWotask', {
			url: '/wotasks/:wotaskId/edit',
			templateUrl: 'modules/wotasks/views/edit-wotask.client.view.html'
		});
	}
]);