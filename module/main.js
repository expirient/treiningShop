var module = angular.module('mainApp',['productApp','cartApp','paginationApp','categoryApp','orderApp','usersApp']);
module.controller('mainCtrl', function($scope,$http){
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


	$scope.isLogin = true;
	$scope.isTrueLogin = function(obj){
		//console.log(obj);
		$http.get('/isTrueLogin').then(function(data){
			/*if (data.data == '') {
				return;
			}
			else{
				$scope.logUser = {};
				$scope.isLogin = false;
				//$scope.successLogin();
				$scope.loginUser = data.data;
			}*/
		});
	}
	//$scope.isTrueLogin();


	/*$scope.successLogin = function(){
		$http.get('/successLogin').then(function(data){
			$scope.loginUser = data.data;
		});
	}*/
	$scope.newLogin = function(){
		$scope.isLogin = true;
	}
});	