var module = angular.module('orderApp',[]);
module.controller('orderCtrl', function($scope,$http,$timeout){
	
	//$scope.inputForOrderPhone = true;

	$scope.getOrders = function(){
		$scope.sortparam = "-date";
		$http.get('/loadOrders').then(function(data){
			$scope.newOrders = [];
	        $scope.filterOrders = [];
			$scope.newOrders = data.data;
			//$scope.sortedOrders = $filter('orderBy')($scope.newOrders,'date');
			for(var i = 0; i < $scope.newOrders.length; i++){
				if ($scope.newOrders.isItDone == true) {
					continue;
				}
				$scope.filterOrders.push($scope.newOrders[i]);
			}
			$scope.filterOrders.sort(function(a, b) {
			    if(a.date == b.date) return 0;
			    if(a.date < b.date) return 1;
			    if(b.date < a.date) return -1;
			    return 0; //в независимости от других свойств считаем что объекты равны
			});
		});
	}
	$scope.removeOrder = function(obj){
		//console.log(obj);
		$http.post('/removeOrder',obj).then(function(data){
			$scope.getOrders();
		});
	}
	$scope.doneOrder = function(obj,event,item){
		console.log(obj);
		//console.log(item);
		item.updatingId = obj._id;
		item.thisDateForUpdate = obj.date;
		$(event.currentTarget).css({'background':'#999'});
		//$scope.isDone = true;
		obj.isItDone = true;
		$http.post('/updateThisOrder',item).then(function(data){
			console.log(data.data);
		});
		$scope.updateClientOrder(item);
	}
	$scope.updateClientOrder = function(obj){
		$http.post('/updateClientOrder',obj).then(function(data){
			console.log(data.data);
		});
	}
	$scope.removeItemInOrder = function(obj){
		$http.post('/removeItemInOrder',obj).then(function(data){
			//console.log(obj);
			$scope.getOrders();
		});
	}
	var date = new Date();
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
	
	$scope.isLoginedUser = function(){
		$http.get('/getFacebookUser').then(function(data){
			//console.log(data.data);
			$scope.isUser = data.data;
			//console.log($scope.facebookUser);
		});
		//console.log($scope.isUser);
	}
		
	$scope.sendOrder = function(obj){
		$scope.isLoginedUser();
		$timeout(function(){
			//console.log($scope.isUser);
			$scope.order = obj;
			for(var i = 0; i < $scope.cart.length; i++){
				$scope.cart[i].count = $scope.cart[i].count - $scope.cart[i].newcount;
				$scope.updateProduct($scope.cart[i]);

				for(var key in $scope.cart[i]){
					$scope.cart[i].isItDone = false;
				}
			}
			//console.log(typeof($scope.isUser));
			if (typeof($scope.isUser) == "string" || $scope.isUser.username !== undefined) {
				//$scope.inputForOrderPhone = true;
				$scope.order = {
					date: $scope.newDate,
					client: 'Guest',
					phone: obj.phone,
					order: $scope.cart,
					email: 'Відсутня ел. адреса',
				};
				$scope.sendThisOrder($scope.order);
			}
			else{
				$scope.order = {
					date: $scope.newDate,
					client: $scope.isUser.name,
					phone: obj.phone,
					order: $scope.cart,
					email: $scope.isUser.email,
				};
				$scope.updateUserOrder($scope.isUser);
				$scope.sendThisOrder($scope.order);
			}
			
		},200)
	}
	$scope.sendThisOrder = function(obj){
		$http.post('/addOrder',obj).then(function(data){
			//console.log($scope.cart);
			alert('Замовлення успішно сформоване!');
			$scope.showProduct();
			$scope.clearCart();
			//window.location.reload();
		});
	}

	$scope.updateUserOrder = function(objUser){
		for(var i = 0; i < $scope.cart.length; i++){
			$scope.cart[i].date = $scope.newDate;
			$scope.isUser.orders.unshift($scope.cart[i]);
		}
		var updateUser = {
			_id: objUser._id,
			name: objUser.name,
			email: objUser.email,
			token: objUser.token,
			photos: objUser.photos,
			orders: $scope.isUser.orders,
			isItDone: objUser.isItDone
		}
		$http.post('/updateUserOrder',updateUser).then(function(data){
			//console.log(data.data);
		});
	}
	$scope.saveNewPhoto = function(obj,thisObj,event){
		if ($('iframe')[0].contentDocument.body.innerHTML == '') {
			alert("Виберіть файл для зміни фото!");
			return;
		}
		/*console.log(obj)
		console.log(thisObj);
		console.log(event);
		console.log(window.frames['Newresult']);
		var iframeWin = window.frames['Newresult'];
		iframeWin.parent == window;
		console.log(iframeWin.parent);*/
		//console.log($('iframe')[0].contentDocument.body.innerHTML);
		$scope.isUser.photos = $('iframe')[0].contentDocument.body.innerHTML;
		$http.post('/updatePhoto',$scope.isUser).then(function(data){
			$scope.getFacebookUser();
			$scope.showPhotoEdit = false;
		})
		/*$timeout(function(){
			console.log($scope.isUser);
		},500)*/
		//console.log(window.frames.contentBlock.body.innerHTML);
	}
	//console.log($scope.boolVerification);
	$scope.isLoginedUser();
	$scope.getOrders();
});	