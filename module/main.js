var module = angular.module('mainApp',['productApp','cartApp','paginationApp','categoryApp','orderApp','usersApp','adminApp']);
module.controller('mainCtrl', function($scope,$http){
	/*$scope.currentView = 'view/products.html';*/
	$scope.current = {
		currentView: 'view/products.html',
		adminCurrentView: 'viewAdmin/adminProducts',
		headingView: 'Товари магазину:',
		routing: ' Головна '
	}

	$scope.showMenu = true;

	$scope.reload = function(){
		window.location.reload();
	}
	//$scope.headingView = 'Товари магазину:';
	$scope.showCart = function(){
		$scope.current.currentView = 'view/cart.html';
		$scope.current.headingView = 'Корзина: ';
		$scope.current.routingCart = ' Корзина';
	};
	$scope.showProduct = function(){
		$scope.current.currentView = 'view/products.html';
		$scope.current.headingView = 'Товари магазину: ';
	};
	$scope.showAddProduct = function(){
		$scope.current.headingView = 'Додавання товару: ';
		$scope.current.adminCurrentView = 'viewAdmin/addProduct.html';
		$scope.current.routingAddProduct = ' Додавання Товару';
	};
	$scope.showAdminProducts = function(){
		$scope.current.headingView = 'Адміністрування: ';
		$scope.current.adminCurrentView = 'viewAdmin/adminProducts.html';
	}
	$scope.showAdminCategory = function(){
		$scope.current.headingView = 'Адміністрування категорій: ';
		$scope.current.adminCurrentView = 'viewAdmin/adminCategory.html';
		$scope.current.routingCategory = ' Категорії'
	};
	$scope.showAdminOrders = function(){
		$scope.current.headingView = 'Замовлення: ';
		$scope.current.adminCurrentView = 'viewAdmin/order.html';
		$scope.current.routingOrder = ' Замовлення';
	}

	$scope.showSingleProduct = function(obj){
		$scope.current.currentView = 'view/productView.html'
		$scope.singleItem = obj;
		$('html,body').animate({
			scrollTop:700},1000);
		return;
	}
	$scope.showPersonalRoom = function(){
		$scope.current.currentView = 'view/personalRoom.html';
		$scope.current.headingView = 'Особистий кабінет: ';
	}
	$scope.showAllUsers = function(){
		$scope.current.adminCurrentView = 'viewAdmin/users.html'
	}
	$scope.showAboutProject = function(){
		$scope.current.currentView = 'view/aboutProject.html';
		$scope.current.headingView = 'Про Проект: ';
	}

	$scope.showOrHideMenu = function(){
		$('.menu').slideToggle(400);
	}

	$scope.isLogin = true;
	$scope.isTrueLogin = function(obj){
		
		$http.get('/isTrueLogin').then(function(data){
			
		});
	}
	
	$scope.newLogin = function(){
		$scope.isLogin = true;
	}
	
});	