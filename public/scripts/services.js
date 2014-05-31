angular.module('intraX.services', [])
.factory("SessionService", function() {
	return {
		get: function(key) {
			return sessionStorage.getItem(key);
		},
		set: function(key, val) {
      return sessionStorage.setItem(key, val);
		},
		unset: function(key) {
			return sessionStorage.removeItem(key);
		}
	}
});
// .factory("FlashService", function($rootScope) {
// 	return {
// 		show: function(message) {
// 			$rootScope.flash = "Flash : " + message;
// 		},
// 		clear: function() {
// 			$rootScope.flash = "";
// 		}
// 	}
// });
