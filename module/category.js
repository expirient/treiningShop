var module = angular.module('categoryApp',[]);

module.controller('categoryCtrl', function($scope,$http,$timeout){
	//$scope.categorys = [];
	
	/*$scope.categoryData = function(){
		$scope.$broadcast('categorys',{categorys: $scope.categorys});
	}*/
	/*$timeout(function(){	
		$http.get('/loadCategory').then(function(data){
			$scope.categorys = data.data;
			console.log($scope.categorys);
			 $scope.newp = {
			    category :$scope.categorys[0]._id
			  };
			  console.log($scope.newp);
		});
	},0);*/
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
				console.log($scope.selectCategory);
		});
	},0);

	
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

	/*$timeout(function(){
		$scope.newp = {
		    category :$scope.categorys[0].name
		};
	},1000);*/
	
	$scope.getCategory = function(){
		$http.get('/loadCategory').then(function(data){
			$scope.categorys = data.data;
			//console.log($scope.categorys);
		});
		//console.log($scope.categorys);
	}
	//console.log($scope.categorys);
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