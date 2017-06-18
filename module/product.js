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

	$scope.$on('selectCategory',function(event,args){
		$scope.forSendCategory = args.selectCategory;
	});	
	

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
		//console.log(obj);
		var newProduct = {
			name: obj.name,
			model: obj.model,
			category: $("#category option:selected").text(),
			count: obj.count,
			price: obj.price,
			path: obj.path,
			description: obj.description
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
			_id: obj._id,
			name: obj.name,
			model: obj.model,
			category: $("#category option:selected").text() || obj.category,
			count: obj.count,
			price: obj.price,
			path: obj.path,
			description: obj.description
		}
		//console.log(updateProduct);
		$http.post('/updateProduct',updateProduct).then(function(data){
			//console.log(data);
			if ($scope.current.currentView == 'view/curt.html') {
				return;
			}
			$scope.getProducts();
			$scope.showAdminProducts();
			$scope.newp = {};
			//window.location.reload();
		});
	}
	$scope.deleteProduct = function(obj){
		$http.post('/deleteProduct',obj).then(function(data){
			$scope.showAdminProducts();
			$scope.getProducts();
		});
	}
	$scope.getProducts = function(obj){
		//console.log($scope.forSendCategory);
		if ($("#my_select option:selected").text() !== 'Усі товари' && obj !== undefined && obj.category == undefined) {
			obj = {
				name: obj.name,
				category: $("#my_select option:selected").text()
			}
			$scope.hideLi(obj.name);
		}
		
		if ( obj !== undefined && obj.category == undefined) {
			$scope.hideLi(obj.name);
		}
		$http.post('/load',obj).then(function(data){
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

	$scope.load = true;

	$scope.selectProduct = function(obj){
		$scope.load = false;
		//console.log(obj);
		$('.searchingInput').val('');
		var redirectCategory = {
			category: $("#my_select option:selected").text()
		}
		if (redirectCategory.category == 'Усі товари') {
			redirectCategory = {};
			$scope.load = true;
		}
		//console.log(redirectCategory);
		$scope.getProducts(redirectCategory);
	}
	$scope.search = {}
	$scope.searchingProducts = function(item){
		$scope.liItems = [];
		var output = [];
		$scope.visual = false;

		if ($scope.load == true) {
			$scope.getProducts();
		}
		
		for(var i = 0; i < $scope.products.length; i++){
			
			if($scope.products[i].name.toLowerCase().match(item.toLowerCase()) !== null){
				if (output.indexOf($scope.products[i].name) !== -1) {
					continue;
				}
				/*var letters = $scope.products[i].name; 
				for(var j = 0; j < letters.length; j++){
					if (letters[j] == item) {
						$(letters[j]).addClass('sch');
					}
				}*/
				output.push($scope.products[i].name);
				$scope.liItems = output;

				if ($scope.products[i].name.toLowerCase().match(item.toLowerCase()) == '') {
					$scope.liItems = [];
					output = [];
					$scope.load = false;
				}
			}
		}
		
	}
	
	$scope.hideLi = function(item){
		$scope.search.item = item;	
		$scope.visual = true;
	}
	
	$scope.getProducts();
	
});


