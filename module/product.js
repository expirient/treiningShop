var module = angular.module('productApp',[]);
	
	/*module.directive('orderList',function(){
		return function(scope,element,attributes){
			var display = attributes['display'];
			var arr = display.split(' ');
			var attr = attributes['orderList'];
			console.log(attr);
			var data = scope[attr];
			var ul = angular.element('<ul>');
			element.append(ul);// element з точки зору ангулар і є дів в якому викликана директива
			for(var i = 0; i < data.length; i++){
				var li = angular.element('<li>');
				//li.text(data[i][display]);
				li.text('')
				for(var j = 0; j < arr.length; j++){
					li.text(li.text() + ' ' + data[i][arr[j]]);
				}
				ul.append(li);
			}
		}
	});*/

	module.directive('sendData',function(){
		return function(scope,element,attributes){
			element.on('load',function(e){
				var path = e.target.contentDocument.body.innerHTML;
				console.log(path);
				//scope.newp.path = path;
				scope.$apply(function(){
					scope.newp.path = path;
				});
			});
		}
	});

module.controller('productCtrl', function($scope,$http){
	$scope.products = [];

	$scope.sendData = function(){
		$scope.$broadcast('products',{products: $scope.products});
	}

	$scope.addProduct = function(obj){
		$http.post('/addNewProduct',obj).then(function(data){
			/*$scope.current.currentView = 'view/products.html';
			$scope.current.headingView = 'Товари магазину: ';*/
			$scope.showAdminProducts();
			if(data.data == ''){
				return;
			}
			$scope.products.push(data.data);
			$scope.newp = {};
		});
	}
	$scope.updateProduct = function(obj){
		$http.post('/updateProduct',obj).then(function(data){
			//console.log(data);
			if ($scope.current.currentView == 'view/curt.html') {
				return;
			}
			$scope.showAdminProducts();
			$scope.newp = {};
		});
	}
	$scope.deleteProduct = function(obj){
		$http.post('/deleteProduct',obj).then(function(data){
			$scope.showAdminProducts();
			$scope.getProducts();
		});
	}
	$scope.getProducts = function(){
		$http.get('/load').then(function(data){
			//console.log(data.data);
			$scope.products = data.data;
			$scope.sendData();
		});
	}
	$scope.editOrAdd = function(obj){
		$scope.newp = obj ? obj : {};
		$scope.showAddProduct()
	}
	$scope.saveProduct = function(obj){
		if (angular.isDefined(obj._id)) {
			$scope.updateProduct(obj);
		}
		else{
			$scope.addProduct(obj);
		}
	}
	$scope.getProducts();
});	