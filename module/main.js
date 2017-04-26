var module = angular.module('mainApp',['productApp','cartApp','paginationApp','categoryApp','orderApp']);
module.controller('mainCtrl', function($scope){
	/*$scope.currentView = 'view/products.html';*/
	$scope.current = {
		currentView: 'view/products.html',
		headingView: 'Товари магазину:'
	}
	//$scope.headingView = 'Товари магазину:';
	$scope.showCart = function(){
		$scope.current.currentView = 'view/cart.html';
		$scope.current.headingView = 'Корзина: ';
	};
	$scope.showProduct = function(){
		$scope.current.currentView = 'view/products.html';
		$scope.current.headingView = 'Товари магазину: ';
	};
	$scope.showAddProduct = function(){
		$scope.current.headingView = 'Додавання товару: ';
		$scope.current.currentView = 'viewAdmin/addProduct.html';
	};
	$scope.showAdminProducts = function(){
		$scope.current.headingView = 'Адміністрування: ';
		$scope.current.currentView = 'viewAdmin/adminProducts.html';
	}
	$scope.showAdminCategory = function(){
		$scope.current.headingView = 'Адміністрування категорій: ';
		$scope.current.currentView = 'viewAdmin/adminCategory.html';
	};
	$scope.showAdminOrders = function(){
		$scope.current.headingView = 'Замовлення: ';
		$scope.current.currentView = 'viewAdmin/order.html';
	}
});	