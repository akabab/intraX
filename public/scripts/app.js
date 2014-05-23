'use strict';

angular.module('intraX', [])

//◤◥◣◢◤◥◣◢◤◥◣◢◤◥◣
//	STARTING CONFIG FILE
//◣◢◤◥◣◢◤◥◣◢◤◥◣◢◤

//ᚊᚊᚊᚊᚊᚊ
//	rooting
//ᚅᚅᚅᚅᚅᚅ

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'index'
		})
		.when('/#/test', {
			templateUrl: '/template/user'
		})
		.otherwise({
			redirectTo: '/'
		});
	$locationProvider.html5Mode(true);
});
