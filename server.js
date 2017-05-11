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
	//console.log(req.file);
	res.send(req.file.path);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Встановлення каталогу для статичного контенту! (CSS/script)

app.get("/",function(req,res){ //опрацьовуємо корінь сайту "/" + callback (req,res)
	res.sendFile(__dirname + "/index.html");
});

// Connecting to Models
var Products = require('./models/product');
var Peoples = require('./models/users');
var Category = require('./models/category');
var Order = require('./models/orders');
var Admin = require('./models/admin');


					//PASPORT
/*-------------------------------------------------------*/
var cookieParser = require('cookie-parser');
	app.use(cookieParser());

var session = require('cookie-session');
	app.use(session({keys:['secret'],maxAge: 2*60*60*1000})); // підбор секретного ключа

var passport = require('passport');
	app.use(passport.initialize()); // приєднали до еkспреса
	app.use(passport.session()); // приєднуємо до сессії

var localStrategy = require('passport-local').Strategy // підключаємо стратегію для паспорта
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
	}));

/*var NewlocalStrategy = require('passport-local').Strategy
	passport.use(new NewlocalStrategy(function(login,password,done){
		Peoples.find({login: login, password: password},function(err,data){
			console.log(data);
		});
	}))	*/

	/*passport.use(new localStrategy(function(login,password,done){
		Peoples.find({login: login, password: password},function(err,data){
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
	}));

	passport.serializeUser(function(user,done){
		//console.log(user);
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done){
		Peoples.find({_id: id},function(err,data){
				//console.log(data);
				done(null,{login:data[0].login, id: data[0]._id}); //Витягуєм імя користувача {username:data[0].name} замість data
			});
	});*/

	passport.serializeUser(function(user,done){
		//console.log(user);
		done(null,user.id);
	});

	//Десеріалізація пройде тільки після аутентифікаціі користовача
	// Bсі наступні звернення по id сессії
	passport.deserializeUser(function(id,done){
		/*connection.query('SELECT name FROM newpeoples WHERE id = ?'*/
		Admin.find({_id: id},function(err,data){
				//console.log(data);
				done(null,{username:data[0].username, id: data[0]._id}); //Витягуєм імя користувача {username:data[0].name} замість data
			});
	});

	var auth = passport.authenticate('local',{
			successRedirect: '/admin',
			failureRedirect: '/login'
	}); // маршрутизація
	// Перевірка авторизації MiddleWar
	var myAuth = function(req,res,next){
		
		if(req.isAuthenticated())// повертае  true/false
			next();
		else
			res.redirect('/login');
	}
	app.post('/login',auth);
	app.get('/admin',myAuth);
/*-------------------------------------------------------*/



app.post('/load',function(req,res){
	//console.log(req.body.value);
	if (req.body.value == '' || req.body.value == undefined) {
		Products.find(function(err,data){
			res.send(data);
		});
	}
	else{
		Products.find({category: req.body.value},function(err,data){
			res.send(data);
		});
	}
	/*if (req.body.category == undefined) {
		Products.find(function(err,data){
			res.send(data);
		});
	}
	else if (req.body.category !== undefined) {
		//console.log(req.body.category);
		Products.find({category: req.body.category},function(err,data){
			res.send(data);
		});
	}*/
});
/*app.get('/load',function(req,res){
	Products.find(function(err,data){
		res.send(data);
	});
})*/

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
		console.log(data);
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
	console.log(req.body);
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
		order: req.body.order
	});
	//console.log(order.order);
	order.save(function(err,data){
		res.send(data);
	});
});
app.get('/loadOrders',function(req,res){
	Order.find(function(err,data){
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
app.get('/isTrueLogin',function(req,res){
	/*Peoples.find({login:req.body.login, password: req.body.password},function(err,data){
		console.log(data);
		//res.send(req.user.login);
	});*/
	res.send(req.user.login);
});

app.listen(process.env.PORT||8080); // задаємо порт
console.log("Start server!");