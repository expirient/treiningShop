var module = angular.module('usersApp',[]);
module.controller('usersCtrl',function($scope,$http,$timeout){

	$scope.error;
	$scope.bool = false;
	$scope.facebookLogined = false;
	$scope.facebookUser = {};
	$scope.hideTextArea = false;
	$scope.newMessageOfAdmin = {};
	$scope.allMessages = [];
	$scope.newMessageOfOneFBuser = [];
	$scope.showBoxMessages = false;
	$scope.showTextArea = false;

	$scope.isNewUser = function(obj){
		//console.log(obj);
		var arr = $('#phone').val();
		var str = arr.split('(').join('').split(')').join('').split(' ')
		.join('').split('-').join('').split('+3').join('');

		
			if (/^[a-zA-Z1-9]+$/.test($scope.newUser.name) === false) {
				$scope.error = "Введіть ім'я латинськими літерами...";
				$scope.newUser.name = '';
				$scope.bool = true;
				return;
			}
			if ($scope.newUser.name.length < 2 || $scope.newUser.name.length > 20) {
				$scope.error = '';
				$scope.error = "Ім'я повинно бути не менше двох та не більше двадцяти символів...";
				$scope.newUser.name = '';
				$scope.bool = true;
				return;
			}
			if (/^[a-zA-Z1-9]+$/.test($scope.newUser.login) === false) {
				$scope.error = "Введіть Логін латинськими літерами...";
				$scope.newUser.login = '';
				$scope.bool = true;
				return;
			}
			if ($scope.newUser.login.length < 2 || $scope.newUser.login.length > 20) {
				$scope.error = '';
				$scope.error = "Логін повинний бути не менше двох та не більше двадцяти символів...";
				$scope.newUser.login = ''
				$scope.bool = true;
				return;
			}
			if (/.+@.+\..+/i.test($scope.newUser.email) === false) {
				$scope.error = '';
				$scope.error = "Некоректно введена Електронна Адреса...";
				$scope.newUser.email = ''
				$scope.bool = true;
				return;
			}
			if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/.test($scope.newUser.password) === false) {
				$scope.error = '';
				$scope.error = 'Пароль має бути введений латинськими літерами, має містити хочаб одну велику літеру. має містити цифри та бути довжиною від 8 до 16 символів...';
				$scope.newUser.password = ''
				$scope.bool = true;
				return;
			}
			else{
				var isNewUser = {
					id: $scope.randomNumbersForId(),
					name: obj.name,
					login: obj.login,
					phone: str,
					email: obj.email,
					password: obj.password + obj.login
				};
				//console.log($scope.peoples);

				for(var i = 0; i < $scope.peoples.length; i++){

					for(var key in $scope.peoples[i]){
						if (key == 'phone') {
							//console.log($scope.peoples[i][key] + ' ' + isNewUser.phone);
							if ($scope.peoples[i][key] == isNewUser.phone) {
								$scope.bool = true;
								$scope.error = 'Такий Номер Телефону вже зареєстрований!';
								$('#phone').val('');
								return;
							}
						}
						if (key == 'login') {
							//console.log($scope.peoples[i][key] + ' ' + isNewUser.login);
							if ($scope.peoples[i][key] == isNewUser.login) {
								$scope.bool = true;
								$scope.error = 'Такий Логін вже зареєстрований!';
								$scope.newUser.login = '';
								return;
							}
						}
						if (key == 'email') {
							//console.log($scope.peoples[i][key] + ' ' + isNewUser.email);
							if ($scope.peoples[i][key] == isNewUser.email) {
								$scope.bool = true;
								$scope.error = 'Така Електронна Адреса вже зареєстрована!';
								$scope.newUser.email = '';
								return;
							}
						}
					}
				}
				$scope.bool = false;
				$scope.error = '';
				$scope.addNewUser(isNewUser);
				$scope.sendMassegeForNewUser = {
					text: "Вітаємо на Сайті " + $scope.isNewUser.name + "!"
				}
				$scope.thisUser = {}
				$scope.thisUser.item = {};
				$scope.thisUser.item = {id: isNewUser.id}
				
				$scope.sendMassege($scope.thisUser,$scope.sendMassegeForNewUser);	
			}
	}
	$scope.newId = '';
	$scope.randomNumbersForId = function(){
		//console.log('IM GET THIS');
		var maxNum = 99999;
		var maxNumLength = maxNum.toString().length;
		var iterates = 10;
		var fullRandomNum = '';

		for(var i = 0; i < iterates; i++){
			fullRandomNum += getRandomBetween(0,9).toString(36);
			fullRandomNum += getRandomBetweenLiters();
		}
		
	    function getRandomBetweenLiters() {
	    	return Math.random().toString(36).split('.').join('');
	    }
	    function getRandomBetween(min, max) {
	        return Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	    return fullRandomNum;
	}


	$scope.addNewUser = function(obj){
		$http.post('/addUser',obj).then(function(data){
			alert('Вітаємо! Ви успішно зареєструвались!');
			$scope.showRegForm = false;
			$scope.newUser = {};
			$('#phone').val('');
			$scope.error = '';
			$scope.bool = false;
		});
	}


	
	$scope.resetFields = function(){
		$scope.showRegForm = false;
		$scope.newUser = {};
		$('#phone').val('');
		$scope.error = '';
		$scope.bool = false;
	}

	$scope.getPeoples = function(){
		$http.get('/getPeoples').then(function(data){
			//console.log(data.data);
			$scope.peoples = data.data;
		});
	}

	$scope.FBusers = [];
	$scope.getFacebookUser = function(){
		$http.get('/getFacebookUser').then(function(data){
			if (data.data.length == 0) {
				return;
			}
			$scope.facebookUser = data.data;
			//console.log($scope.facebookUser);
			if ($scope.facebookUser.photos == "") {
				$scope.facebookUser.photos = "images/emptyUserPhoto.jpg";
			}
			$scope.FBusers.push($scope.facebookUser);

			$scope.dataVisible = false;
			
			if ($scope.facebookUser !== '') {
				$scope.facebookLogined = true;
				/*for(var i = 0; i < $scope.facebookUser.orders.length; i++){
					if ($scope.facebookUser.orders[i].isItDone == true) {
						return "Виконано";
					}
					else{
						return "У процесі";
					}
				}*/
			}
			else{
				$scope.facebookLogined = false;
			}
		});
	}
	$scope.changeText = function(change){
		//console.log(change);
		if (change) return "Виконано!";
		return "В процесі.";
	}
	$scope.changeColor = function(change){
		if (change) return "color: green; font-weight: bold;";
		return "color: red; font-weight: bold;";
	}

	var date = new Date();
		var options = {
		  year: 'numeric',
		  month: 'numeric',
		  day: 'numeric',
		  weekday: 'long',
		  timezone: 'UTC',
		  hour: 'numeric',
		  minute: 'numeric',
		  second: 'numeric'
		};
	$scope.realDate = date.toLocaleString('uk',options);

	$scope.forFacebookUser = function(){
		//.log($scope.facebookUser);
	}
	$scope.logoutFacebookUser = function(){
		$http.get('/logout').then(function(data){
			window.location.reload();
		});
	}
	
	$scope.sendMassege = function(obj,msg){
		
		if (msg == undefined || msg.text == "") {
			alert('Введіть текст повідомлення!');
			return;
		}
		console.log(msg);
		console.log(obj);
		$scope.newMessage = {
			date: $scope.realDate,
			author: 'Адміністрація',
			text: msg.text,
			isNewMessage: true
		}
		obj.item.newMessage = $scope.newMessage;
	
		$http.post('/updateMessageFBusers',obj.item).then(function(data){
		
			$scope.newMessage = {};
			obj.item.newMessage = {};
			//$('textarea').val('');
			msg.text = '';
			$scope.message = {};
			$scope.showTextArea = false;
			$scope.getMessages();
		});
	}
	//console.log($scope.FBusers);
	$scope.getMyMessages = function(){
		$scope.showBoxMessages = true;
		$scope.getMessages();
	}
	$scope.getMessages = function(){
		//$scope.getFacebookUser();
		//console.log($scope.facebookUser);
		$scope.sortparam = '-date';
		//console.log($scope.facebookUser.messages);
		$scope.newMessageOfOneFBuser = [];
		$scope.allMessages = [];
		//$scope.showBoxMessages = true;
		var myId = {
			_id :  $scope.facebookUser._id
		}
		$timeout(function(){
			$http.post('/getMessages',myId).then(function(data){
				for(var key in data.data[0]){
					
					if (key == 'messages') {
						$scope.allMessages = data.data[0][key];
					}
				}
				
			});
		})
	}
	$scope.messageHesBeenRead = function(obj,item){
		$scope.updateThisMessage = {
			_id: $scope.facebookUser._id,
			text: item.text,
			date: item.date
		}
		$http.post('/messageHesBeenRead',$scope.updateThisMessage).then(function(data){
			/*console.log(data.data);
			console.log($scope.facebookUser);*/
			
			$scope.getMyMessages();
			
			/*$timeout(function(){
				//$scope.getFacebookUser();
				$scope.getMessages();
				console.log($scope.facebookUser);	
			},500);*/
		});
	}
	$scope.forAlert = function(){
		alert('Для зміни фотографії профіля перейдіть у власний кабінет!');
	}

	$scope.showMyProducts = function(){
		$scope.getFacebookUser();
		$scope.showProduct();
	}

	
	$scope.getFacebookUser();
	$scope.getPeoples();
	//$scope.getMessages();
	
});	