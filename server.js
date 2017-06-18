var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");

var storage = multer.diskStorage({destination: function(req,file,cb){
	cb(null,'./img/')
},
filename: function(req,file,cb){
	cb(null,file.originalname)
}
});
var upload = multer({storage: storage});
app.post('/uploadFile',upload.single('upl'), function(req,res){
	req.filename = req.originalname;
	console.log(req.file);
	res.send(req.file.path);
});
app.post('/uploadPhoto',upload.single('pht'),function(req,res){
	req.filename = req.originalname;
	console.log(req.file)
	res.send(req.file.path);
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Встановлення каталогу для статичного контенту! (CSS/script)

app.get("/",function(req,res){ //опрацьовуємо корінь сайту "/" + callback (req,res)
	res.sendFile(__dirname + "/index.html");
});

 /*-------------Connecting to Models--------------*/
var Products = require('./models/product');
var Peoples = require('./models/users');
var Category = require('./models/category');
var Order = require('./models/orders');
var Admin = require('./models/admin');
var facebookUsers = require('./models/facebookUsers');


					//PASPORT FOR ADMIN
/*-------------------------------------------------------*/
var cookieParser = require('cookie-parser');
	app.use(cookieParser());

var session = require('cookie-session');
	app.use(session({keys:['secret'],maxAge: 2*60*60*1000})); // підбор секретного ключа

var passport = require('passport');
	app.use(passport.initialize()); // приєднали до еkспреса
	app.use(passport.session()); // приєднуємо до сессії

/*var localStrategy = require('passport-local').Strategy // підключаємо стратегію для паспорта
	passport.use(new localStrategy(function(username,password,done){
		Admin.find({username: username, password: password},function(err,data){
				//console.log(data);
				if(data.length == 1){
					//console.log(data[0].name);
					//console.log(data[0].id);
					return done(null,{id: data[0]._id});// Вибірка по ід
					// аутентифікація пройшла успішно
				}
				else{
					return done(null,false);
				}
			});
	}));*/


	passport.serializeUser(function(user,done){
		//console.log(user);
		done(null,user.id);
	});

	//Десеріалізація пройде тільки після аутентифікаціі користовача
	// Bсі наступні звернення по id сессії
	passport.deserializeUser(function(id,done){
		/*connection.query('SELECT name FROM newpeoples WHERE id = ?'*/
		Admin.find({_id: id},function(err,data){

			if (data.length == 1) {
				done(null,{username:data[0].username, id: data[0]._id}); //Витягуєм імя користувача {username:data[0].name} замість data
			}	//console.log(data);
			
		});
		facebookUsers.find({_id: id},function(err,data){
			if (data.length == 1) {
				done(null,data[0]); // повертаємо цілого юзера
			}
		});
	});

	var auth = passport.authenticate('local',{
			successRedirect: '/admin',
			failureRedirect: '/login'
	}); // маршрутизація
	// Перевірка авторизації MiddleWar
	var myAuth = function(req,res,next){
		
		if(req.isAuthenticated()){// повертае  true/false
			if (req.user.username !== 'admin' || req.user.username == undefined) {
				res.redirect('/login');
			}
			next();
		}	
		else{
			res.redirect('/login');
		}
	}
	app.post('/login',auth);
	app.get('/admin',myAuth);

	app.get('/login',function(req,res){
		res.sendFile(__dirname + '/viewAdmin/login.html');
	});
	app.get('/admin',function(req,res){
		res.sendFile(__dirname + '/viewAdmin/admin.html');
	});

	app.get('/getUser',function(req,res){
		//console.log(req.user); 
		res.send(req.user.username);// дістаємо юзера (обєкт)
	});
	app.get('/logout',function(req,res){
		req.session = null; // Вбиваємо сессію
		res.send('logout');
	});
/*-------------------------------------------------------*/



/*---------------FACEBOOK LOGIN STRATEGY-----------------*/
var facebookStrategy = require('passport-facebook').Strategy;
var facebookAuth = {
	clientID: '280816772328919',
	clientSecret: '4608fb4c1a496d0ee71afaa8f5c80adc',
	callbackURL: 'https://shop1expirient.herokuapp.com/auth/facebook/callback'
}	
passport.use(new facebookStrategy({
	"clientID": facebookAuth.clientID,
	"clientSecret": facebookAuth.clientSecret,
	"callbackURL": facebookAuth.callbackURL,
	"profileFields": ['id','displayName','photos','email']
},function(token,refreshToken,profile,done){
	//console.log(profile);
	
	facebookUsers.find({id: String(profile.id)},function(err,data){
		//console.log(data);
		if (data.length == 1) {
			return done(null,{
				id: data[0]._id
			});
		}
		else{
			var newUser = new facebookUsers({
				id: profile.id,
				name:  profile.displayName,
				login:  profile.displayName,
				email: getMail(), 
				/*function(){
					if (profile.emails[0].value !== undefined) {
						return profile.emails[0].value;
					}
					else {
						return '';
					}
				},*/
				//email: profile.emails[0].value || "",
				token: token,
				photos: profile.photos[0].value || ""
			});
			newUser.save(function(err,data){
				//console.log(data);
				//res.send('Succes save facebook user...');
				if(err){
					console.log(err);
					return;
				}
				return done(null,{
					id: data._id
				});
			});
		}

		function getMail(){
			if (profile.emails == undefined) {
				profile.emails = [{value: profile.id}];
				//console.log(profile);
				return profile.emails[0].value;
			}
			else{
				return profile.emails[0].value;
			}
		}
	});

}));
	/*var myAuthFacebook = function(req,res,next){
		
		if(req.isAuthenticated())// повертае  true/false
			next();
		else
			res.redirect('/');
	}*/
	app.get('/auth/facebook',passport.authenticate('facebook')); //, {scope: 'email'} можна конкретизувати поля по яким провіряєм

	app.get('/auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect: '/',
		failureRedirect: '/'
	}));
	app.get('/getFacebookUser',function(req,res){
		res.send(req.user);
	});
/*-------------------------------------------------------*/


/*---------------LOGIN STRATEGY FOR USERS----------------*/
	var localStrategy = require('passport-local').Strategy
	passport.use(new localStrategy(function(username,password,done){
		//console.log(username + ' ' + password);
		facebookUsers.find({login: username, token: password + username},function(err,data){
				//console.log(data);
				if(data.length == 1){
					//console.log(data[0].name);
					//console.log(data[0].id);
					return done(null,{id: data[0]._id});// Вибірка по ід
					// аутентифікація пройшла успішно
				}
				else{
					//return done(null,false);
					Admin.find({username:username, password: password},function(err,data){
						if(data.length == 1){
							//console.log(data[0].name);
							//console.log(data[0].id);
							return done(null,{id: data[0]._id});// Вибірка по ід
							// аутентифікація пройшла успішно
						}
						else{
							return done(null,false);
						}
						
					})
				}
			});
	}));
	var authNew = passport.authenticate('local',{
			successRedirect: '/',
			failureRedirect: '/'
	}); // маршрутизація
	app.post('/loginNew',authNew);

/*-------------------------------------------------------*/

app.post('/load',function(req,res){
	
	if (req.body == undefined || req.body.category == '' ) {
		
		Products.find(function(err,data){
			res.send(data);
		});
	}
	else{
		//console.log(req.body);
		Products.find(req.body,function(err,data){
			//console.log(data);
			res.send(data);
		});
	}
	
});

app.get('/loadCategory',function(req,res){
	Category.find(function(err,data){
		res.send(data);
	});
});
app.get('/adminLoadCategory',function(req,res){
	Category.find(function(err,data){
		res.send(data);
	});
});
app.post('/addCategory',function(req,res){
	//console.log(req.body);
	var category = new Category({
		name: req.body.name
	});
	category.save(function(err,data){
		res.send(data);
	})
});
app.post('/deleteCategory',function(req,res){
	Category.remove({_id: req.body._id},function(err,data){
		res.send(data);
	})
});
app.post('/updateCategory',function(req,res){
	//console.log(req.body);
	Category.update({_id: req.body._id},{$set:{name: req.body.name}},function(err,data){
		//console.log(data);
		res.send(data);
	})
})
app.post('/addNewProduct', function(req,res){
	//console.log(req.body);
	var products = new Products({
		name: req.body.name,
		model: req.body.model,
		category: req.body.category,
		count: req.body.count,
		price: req.body.price,
		path: req.body.path,
		description: req.body.description
	});
	products.save(function(err,data){
		//console.log(data.data);
		res.send(data);
	});
});
app.post('/updateProduct', function(req,res){
	//console.log(req.body);
	Products.update({_id: req.body._id},{$set:{
		name: req.body.name,
		model: req.body.model,
		category: req.body.category,
		count: req.body.count,
		price: req.body.price,
		path: req.body.path,
		description: req.body.description
	}},function(err,data){
		res.send(data);
	});
});
/*app.post('/updateCountProduct',function(err,data){
	
})*/
app.post('/deleteProduct', function(req,res){
	Products.remove({_id: req.body._id},function(err,data){
		res.send(data);
	});
})
app.post('/addOrder',function(req,res){
	var order = new Order({
		date: req.body.date,
		client: req.body.client,
		phone: req.body.phone,
		order: req.body.order,
		email: req.body.email,
		//isItDone: req.body.isItDone
	});
	//console.log(order);
	order.save(function(err,data){
		//console.log(data);
		res.send(data);
	});
});
app.get('/loadOrders',function(req,res){
	Order.find({}/*,{$sort:{date: 1}}*/,function(err,data){
		//console.log(data);
		res.send(data);
	});
});
app.post('/removeOrder',function(req,res){
	Order.remove({_id: req.body._id},function(err,data){
		res.send(data);
	});
});
app.post('/removeItemInOrder',function(req,res){
	//console.log(req.body)
	Order.update({'order._id':req.body._id},{$pull: {'order':{_id:req.body._id}}},function(err,data){
		res.send(data);
	});
});

app.get('/getPeoples',function(req,res){
	facebookUsers.find(function(err,data){
		//console.log(data);
		res.send(data);
	});
});

app.post('/isNewUser',function(req,res){
	//console.log(req.body);
	Peoples.find({login: req.body.login, email: req.body.email, phone: +req.body.phone},function(err,data){
		//console.log(data);
		res.send(data);
	});
});
app.post('/addUser',function(req,res){
	var user = new facebookUsers({
		id: req.body.id,
		name: req.body.name,
		login: req.body.login,
		phone: req.body.phone,
		email: req.body.email,
		token: req.body.password,
		photos: ''
	});
	user.save(function(err,data){
		if (err) {
			console.log(err);
		}
		res.send(data);
	});
});
app.post('/updateUserOrder',function(req,res){
	//console.log(req.body);
	facebookUsers.update({_id: req.body._id},{$set:{
		name: req.body.name,
		email: req.body.email,
		token: req.body.token,
		photos: req.body.photos,
		orders: req.body.orders
	}},function(err,data){
		res.send(data);
	});
});
app.post('/updateThisOrder',function(req,res){
	//console.log(req.body);
	Order.update({_id:req.body._id,"order":{$elemMatch:{"_id":req.body.updatingId}}},{$set:{"order.$.isItDone":true}},function(err,data){
		//console.log(data);
		res.send(data);
	});
});
app.post('/updateClientOrder',function(req,res){
	//console.log(req.body);
	facebookUsers.update({name: req.body.client, "orders":{$elemMatch:{"_id": req.body.updatingId,"date": req.body.thisDateForUpdate}}},{$set:{"orders.$.isItDone":true}},function(err,data){
		//console.log(data);
		res.send(data);
	});
});
app.post('/getMessages',function(req,res){
	//console.log(req.body);
	facebookUsers.find({_id: req.body._id},{messages: true},function(err,data){
		if (err) {
			console.log(err);
		}
		//console.log(data);
		res.send(data);
	});
});
app.post('/updateMessageFBusers',function(req,res){
	console.log(req.body);
	if (req.body._id == undefined) {
		facebookUsers.update({id: req.body.id},{$push:{
			"messages": {
				date: req.body.newMessage.date,
				author: req.body.newMessage.author,
				text: req.body.newMessage.text,
				isNewMessage: req.body.newMessage.isNewMessage
			},$position: 0
		}},function(err,data){
			if (err) {
				console.log(err);
			}
			//console.log(data);
			res.send(data);
		});
	}
	else{
		facebookUsers.update({_id: req.body._id},{$push:{
			"messages": {
				date: req.body.newMessage.date,
				author: req.body.newMessage.author,
				text: req.body.newMessage.text,
				isNewMessage: req.body.newMessage.isNewMessage
			},$position: 0
		}},function(err,data){
			if (err) {
				console.log(err);
			}
			//console.log(data);
			res.send(data);
		});
	}
});
app.post('/messageHesBeenRead',function(req,res){

	facebookUsers.update({_id: req.body._id}, {$pull:{"messages":{"text": req.body.text,"date": req.body.date}}},function(err,data){
		console.log(data);
		res.send(data);
	});
});
app.post('/updatePhoto',function(req,res){
	facebookUsers.update({_id: req.body._id},{$set:{photos: req.body.photos}},function(err,data){
		if (err) {
			console.log(err);
			return;
		}
		console.log(data);
		res.send(data);
	});
});

app.listen(process.env.PORT||8080); // задаємо порт
console.log("Start server!");