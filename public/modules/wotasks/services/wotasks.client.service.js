'use strict';

//Wotasks service used to communicate Wotasks REST endpoints
angular.module('wotasks').factory('Wotasks', ['$resource',
	function($resource) {
		return $resource('wotasks/:wotaskId', { wotaskId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);