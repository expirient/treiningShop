var module = angular.module('adminApp',[]);

module.controller('adminCtrl', function($scope,$http){
	$scope.methodIn = function(){
		$http.get('/getUser').then(function(data){
			console.log(data.data);
			$scope.username = data.data;
		});
	}
	$scope.methodIn()
	$scope.logout = function(){
		$http.get('/logout').then(function(data){
			window.location.reload();
		});
	}
});	
