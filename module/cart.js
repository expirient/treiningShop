var module = angular.module('cartApp',[]);

module.controller('cartCtrl', function($scope,$http){
	$scope.cart = [];

	$scope.addProductCart = function(obj){
		var pos = $scope.cart.indexOf(obj);
		if(pos == -1){
			obj.newcount = 1;
			obj.newprice = obj.price;
			$scope.cart.unshift(obj);
			return;
		}
		alert('Цей товар вже є у корзині.');
	}
	$scope.delete = function(obj){
		var pos = $scope.cart.indexOf(obj);
		$scope.cart.splice(pos,1);
	}
	$scope.plusCount = function(obj){
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
	}

	$scope.clearCart = function(){
		$scope.cart = [];
	}

	/*var date = new Date();
		//var today = $filter('date')(date, 'dd.MM.yyyy HH:mm:ss');

		var options = {
		  year: 'numeric',
		  month: 'long',
		  day: 'numeric',
		  weekday: 'long',
		  timezone: 'UTC',
		  hour: 'numeric',
		  minute: 'numeric',
		  second: 'numeric'
		};
		$scope.newDate = date.toLocaleString('uk',options);

	$scope.sendOrder = function(obj){
		
		$scope.order = obj;
		//console.log($scope.cart[0].count);
		
		for(var i = 0; i < $scope.cart.length; i++){
			$scope.cart[i].count = $scope.cart[i].count - $scope.cart[i].newcount;
			$scope.updateProduct($scope.cart[i]);
		}
		
		
		$scope.order = {
			date: $scope.newDate,
			client: 'Guest',
			phone: obj.phone,
			order: $scope.cart
			
		};

		$http.post('/addOrder',$scope.order).then(function(data){
			$scope.cart = [];
			$scope.order = {};
			$scope.showProduct();
			alert('Замовлення успішно сформоване!');
			window.location.reload();
		});
	
	}*/
});