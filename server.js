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

app.get('/load',function(req,res){
	Products.find(function(err,data){
		res.send(data);
	});
});
app.get('/loadCategory',function(req,res){
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
	console.log(req.body);
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
app.get('/admin',function(req,res){
	res.sendFile(__dirname + '/viewAdmin/admin.html');
});
app.listen(process.env.PORT||8080); // задаємо порт
console.log("Start server!");