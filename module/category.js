var module = angular.module('categoryApp',[]);

module.controller('categoryCtrl', function($scope,$http,$timeout){
	$scope.selectCategory = {}
	
	$timeout(function(){
		$http.get('/loadCategory').then(function(data){
			$scope.categoryObj = data.data;
			//$scope.selectCategory = $scope.categoryObj[0]._id

			for(var i = 0; i < $scope.categoryObj.length; i++){
				$scope.categoryObj[i].value = $scope.categoryObj[i].name;
			}
			var first = {
					_id: "1",
					name: "Усі товари",
					value:""
				}
				$scope.categoryObj.unshift(first);
				$scope.selectCategory = {
					name: $scope.categoryObj[0]._id
				}
				/*$scope.selectCategory=$scope.categoryObj[0];*/
				//console.log($scope.selectCategory);
		});
	});

	$scope.sendCategory = function(){
		//console.log($scope.selectCategory);
		$scope.$emit('selectCategory',{selectCategory: $scope.selectCategory});
	}
	
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
		//console.log(obj)
		$http.post('/updateCategory',obj).then(function(data){
				$scope.getCategory();
				//console.log(typeof($scope.category));
		});
	}

	
	$scope.getCategory = function(){
		$http.get('/loadCategory').then(function(data){
			$scope.categorys = data.data;
			//console.log($scope.categorys);
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