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
				//console.log(path);
				//scope.newp.path = path;
				scope.$apply(function(){
					scope.newp.path = path;
				});
			});
		}
	});

module.controller('productCtrl', function($scope,$http,$timeout){
	$scope.products = [];

	$scope.sendData = function(){
		$scope.$broadcast('products',{products: $scope.products});
	}

	/*$timeout(function(){
		$http.get('/loadCategory').then(function(data){
			$scope.categoryObj = data.data;
			$scope.selectCategory = $scope.categoryObj[0].name

			for(var i = 0; i < $scope.categoryObj.length; i++){
				$scope.categoryObj[i].value = $scope.categoryObj[i].name;
			}
			var first = {
					name: "Усі товари",
					value:""
				}
				$scope.categoryObj.unshift(first);
		});
		$scope.selectCategory = {
			name: $scope.first.name
		}
		console.log($scope.selectCategory);
	},0);*/

	$scope.addProduct = function(obj){
		console.log(obj);
		var newProduct = {
			name: obj.name,
			model: obj.model,
			category: $("#category option:selected").text(),
			count: obj.count,
			price: obj.price,
			description: obj.description,
			path: obj.path
		}
		//console.log(newProduct);
		$http.post('/addNewProduct',newProduct).then(function(data){
			$scope.showAdminProducts();
			if(data.data == ''){
				return;
			}
			$scope.products.push(data.data);
			$scope.newp = {};
		});
		//console.log(obj.category);
	}
	$scope.updateProduct = function(obj){
		var updateProduct = {
			name: obj.name,
			model: obj.model,
			category: $("#category option:selected").text(),
			count: obj.count,
			price: obj.price,
			description: obj.description,
			path: obj.path
		}
		$http.post('/updateProduct',updateProduct).then(function(data){
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
	$scope.getProducts = function(obj){
		console.log(obj);
		$http.post('/load',obj).then(function(data){
			$scope.products = data.data;
			$scope.sendData();
		});
	}
	
	/*$scope.getProducts = function(){
		$http.get('/load').then(function(data){
			//console.log(data.data);
			$scope.products = data.data;
			$scope.sendData();
		});
	}*/
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

	/*$scope.myCategory = function(){
		$http.get('/loadCategory').then(function(data){
			$scope.categoryObj = data.data;
			$scope.selectCategory = $scope.categoryObj[0].name

			for(var i = 0; i < $scope.categoryObj.length; i++){
				$scope.categoryObj[i].value = $scope.categoryObj[i].name;
			}
			var first = {
					name: "Усі товари",
					value:""
				}
				$scope.categoryObj.unshift(first);
		});
			
	}*/

	$scope.selectProduct = function(obj){
		//console.log(obj);
		var redirectCategory = {
			value: $("#my_select option:selected").text()
		}
		if (redirectCategory.value == 'Усі товари') {
			redirectCategory = {};
		}
		//console.log(test);
		/*var newStr = $.trim(str);
		//console.log(newStr);

		var obj = {
			category: newStr
		}
		if (obj.category == 'Усі') {
			obj = {};
		}
		//$scope.myC = obj;*/
				//$scope.selectCategory = obj;
				//$scope.getProducts($scope.selectCategory);
		$scope.getProducts(redirectCategory);
	}
	
	//$scope.myCategory();
	$scope.getProducts();
});	