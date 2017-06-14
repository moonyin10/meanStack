var express=require('express')
	stylus=require('stylus'),
	logger=require('morgan')
	bodyParser=require('body-parser')
	mongoose=require('mongoose');
var env= process.env.NODE_ENV||'development'; //environment : dev or production
var app=express();



function compile(str,path){ //for compiling css
	return stylus(str).set('filename',path);
}



app.set('views',__dirname+'/server/views');
app.set('view engine','jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:true})); //body parser
app.use(bodyParser.json());
app.use(stylus.middleware({ //find css file in /public folder and compile
	src:__dirname+'/public',
	compile:compile
}));
app.use(express.static(__dirname+'/public'));

mongoose.connect('mongodb://localhost/meanstack');
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error...'));//listen to error
db.once('open',function callback(){
	console.log('meanstack db opened');
})

var messageSchema=mongoose.Schema({message:String});
var Message= mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(err,messsageDoc){
	mongoMessage=messsageDoc.message;
});



app.get('*',function(req,res){
	res.render('index',{
		mongoMessage:mongoMessage
	});


})

var port=3000;
app.listen(port);
console.log('listening on '+port);







