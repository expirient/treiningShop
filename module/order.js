var module = angular.module('orderApp',[]);
module.controller('orderCtrl', function($scope,$http){
	$scope.newOrders = [];
	$scope.getOrders = function(){
		$http.get('/loadOrders').then(function(data){
			$scope.newOrders = data.data;
		});
	}
	$scope.getOrders();
});	