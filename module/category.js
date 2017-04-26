var module = angular.module('categoryApp',[]);

module.controller('categoryCtrl', function($scope,$http){
	$scope.categorys = [];

	$scope.saveCategory = function(obj){
		$scope.category = {};
		if (angular.isDefined(obj._id)){
			$scope.updateCategory(obj);
			//console.log(typeof($scope.category));
		}
		else{
			$scope.addCategory(obj);
		}
	}
	$scope.addCategory = function(obj){
		$http.post('/addCategory',obj).then(function(data){
				$scope.categorys.push(data.data);
				$scope.getCategory();
		});
	}
	$scope.updateCategory = function(obj){
		$scope.category = {};
		console.log(obj)
		$http.post('/updateCategory',obj).then(function(data){
				$scope.getCategory();
				//console.log(typeof($scope.category));
		});
	}
	$scope.getCategory = function(){
		//$scope.category= '';
		$http.get('/loadCategory').then(function(data){
			$scope.categorys = data.data;
		});
	}
	$scope.deleteCategory = function(obj){
		$http.post('/deleteCategory',obj).then(function(data){
			$scope.getCategory();
		})
	}
	$scope.editOrAdd = function(obj){
		$scope.category = obj ? obj : {};
	}
	$scope.getCategory();
})