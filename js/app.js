
/*var module = angular.module('mainApp',[]);

module.controller('mainCtrl', function($scope, $http){*/
	/*$scope.currentView = 'products.html';
	$scope.headingView = 'Товари магазину:';*/

	//$scope.cart = []; cart

	/*$scope.showCart = function(){
		$scope.currentView = 'cart.html';
		$scope.headingView = 'Корзина: ';
	};
	$scope.showProduct = function(){
		$scope.currentView = 'products.html';
		$scope.headingView = 'Товари магазину: ';
	};*/

	/*$scope.addProductCart = function(obj){ cart
		var pos = $scope.cart.indexOf(obj);
		if(pos == -1){
			obj.newcount = 1;
			obj.newprice = obj.price;
			$scope.cart.push(obj);
			return;
		}
		alert('Цей товар вже є у корзині.');
	}*/
	/*$scope.showAddProduct = function(){
		$scope.headingView = 'Додавання товару: ';
		$scope.currentView = 'addProduct.html';
	}*/
	/*$scope.delete = function(obj){ cart
		var pos = $scope.cart.indexOf(obj);
		$scope.cart.splice(pos,1);
	}*/
	/*$scope.plusCount = function(obj){
		if (obj.newcount >= obj.count) {
			alert('Неможна замовити більше...');
			return;
		}
		else{
			obj.newcount++;
			obj.newprice += obj.price;
		}
	}
	$scope.minusCount = function(obj){
		if (obj.newcount <= 1) {
			$scope.delete(obj);
		}
		else{
			obj.newcount--;
			obj.newprice -= obj.price;
		}
	}
	$scope.totalSum = function(){
		var total = 0;
		for(var i = 0; i < $scope.cart.length; i++){
			total += $scope.cart[i].newprice;
		}
		return total;
	}*/
	/*$scope.addProduct = function(obj){
		$http.post('/addNewProduct',obj).then(function(data){
			$scope.currentView = 'products.html';
			$scope.headingView = 'Товари магазину: ';
			if(data.data == ''){
				return;
			}
			$scope.products.push(data.data);
		});
	}*/
	/*$scope.getProducts = function(){
		$http.get('/load').then(function(data){
			//console.log(data.data);
			$scope.products = data.data;
		});
	}
	$scope.getProducts();*/
//});