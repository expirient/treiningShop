
var module = angular.module('paginationApp',[]);
module.controller('paginationCtrl',function($scope,$http){
	//$scope.getProducts();
	$scope.$on('products',function(event,args){
		$scope.allItems = args.products;
		$scope.setPage(1);
	});
	$scope.allItems = [];
	$scope.allItems = $scope.products;
	/*console.log($scope.products);
	console.log($scope.allItems);*/
	/*$scope.setAllItems = function(n){
		for(var i = 0; i < n; i++){
			$scope.allItems.push('item ' + (i + 1));
		}
	}*/
	/*$scope.setAllItems(300);*/
	$scope.getPage = function(totalItem,currentPage,pageSize){
		var currentPage = currentPage || 1;
		var pageSize = pageSize || 4;
		var totalPage = Math.ceil(totalItem / pageSize);
		var startPage = null;
		var endPage = null;

		if (currentPage == 0) {
			currentPage = 1;
		}
		if (currentPage >= totalPage) {
			currentPage = totalPage;
		}

		if (totalPage <= 10) {
			startPage = 1;
			endPage = totalPage;
		}
		else{
			if (currentPage <= 6) {
				startPage = 1;
				endPage = 10;
			}
			else if(currentPage + 4 > totalPage){
				startPage = totalPage - 9;
				endPage = totalPage;
			}
			else{
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
		}

		var startIndex = (currentPage - 1) * pageSize;
		var endIndex = Math.min(startIndex + pageSize - 1, totalItem - 1);
		var pages = [];
		for(var i = startPage; i <= endPage; i++){
			pages.push(i);
		}
		return{
			pages: pages,
			currentPage: currentPage,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			totalItem: totalItem,
			pageSize: pageSize,
			totalPage: totalPage
		}
	}

	$scope.setPage = function(page){
		//console.log(page);
		$scope.obj = $scope.getPage($scope.allItems.length, page);
		$scope.items = $scope.allItems.slice($scope.obj.startIndex, $scope.obj.endIndex + 1);
	}
	$scope.setPage(1);
});