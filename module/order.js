var module = angular.module('orderApp',[]);
module.controller('orderCtrl', function($scope,$http){
	$scope.newOrders = [];
	$scope.getOrders = function(){
		$http.get('/loadOrders').then(function(data){
			$scope.newOrders = data.data;
		});
	}
	$scope.removeOrder = function(obj){
		//console.log(obj);
		$http.post('/removeOrder',obj).then(function(data){
			$scope.getOrders();
		});
	}
	$scope.doneOrder = function(obj){
		//console.log(obj);

	}
	$scope.removeItemInOrder = function(obj){
		$http.post('/removeItemInOrder',obj).then(function(data){
			//console.log(obj);
			$scope.getOrders();
		});
	}
	$scope.getOrders();
});	