var express = require('express');
var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io').listen(server);
var mongojs =require('mongojs');
var regsterdb =mongojs('registration',['registration']);
var chatdb = mongojs('chatdata',['chatdata']);
var db =mongojs('contactlist',['contactlist']);
var bodyParser =require('body-parser');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

 var multer = require('multer');
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        })
    });
// var server=require('http').createServer(app);
// var io = require('socket.io')(server);
// var socket = io({transports: ['websocket'], upgrade: false});
// var mongoose =require('mongoose');
// mongoose.connect("mongodb://localhost/chat",function(err){
// 	if(err)throw err;
// 	else
// 		console.log("connected ")
// })
// var msgScheme = mongoose.Schema({
// 	msg: String,
// 	time:{type:Date,default:Date.now}
// })
// var Chat =mongoose.model("message",msgScheme);


io.sockets.on('connection',function(){
	console.log("WORKING")
})


io.on('connection', function(socket) {
  console.log('new connection');
  socket.on('put data', function(data) {
  	    
        chatdb.chatdata.insert({ msg:data,date:new Date()},function(err){
        	if(err)
           		throw err;
           	else 
           		io.sockets.emit('get data',data)

           })
  
          
   });
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

// client.on('connection',function(){
// 	sendStatus =function(s){
// 		socket.emit('status',s);
// 		}
// 		chat.find().limt(100).sort('_id:1').toArray(function(err,res){
// 			if(err){
// 				throw err;
// 			}
// 			socket.emit('output',res)
// 		})
// 		socket.on('input',function(data){
// 			if(data.name=="")
// 			{
// 				sendStatus("please type something meesage ")
// 			}
// 			else 
// 				chat.insert({'name':name ,'meesage':meesage},function (){
//                    client.emit('output',[data]);
//                    sendStatus({meesage:'messge sent success',clear:true});
// 				}); 
// 					// body...
				
// 		})
// })
app.get('/contactlist' , function(req,res){
     db.contactlist.find(function (err,docs){
     	res.json(docs);
     })
 
})
app.post('/contactlist' , function(req,res){

     db.contactlist.insert(req.body ,function(err,docs){
            res.json(docs)
     })
 
});
app.delete('/contactlist/:id' , function( req , res){
	  var id = req.params.id;
     db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err,docs){
     		if(err) res.send(400, err);
            res.json(docs);
     })
 
});
app.delete('/contactlist' , function( req , res){
	  
     db.contactlist.remove({}, function(err,docs){
     		if(err) res.send(400, err);
            res.json(docs);
     })
 
});
app.get('/contactlist/:id' , function( req , res){
	  var id = req.params.id;
     db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err,docs){
            res.json(docs)
     })
 
});
app.put('/contactlist/:id' , function( req , res){
	  var id = req.params.id;
     db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
     	update:{$set :{name : req.body.name ,phone : req.body.phone , address : req.body.address}},new:true} , function(err,docs){
            res.json(docs)
     })
 
});
app.get('/registration/' , function( req , res){
	      regsterdb.registration.find(function(err,docs){
            res.json(docs)
     })
 
});
app.post('/registration/' , function( req , res){
     regsterdb.registration.insert(req.body ,function(err,docs){

     	 res.json(docs)
     })
 
});
app.put('/auth' , function( req , res){
     regsterdb.registration.findOne({
  $and: [
    {"username": req.body.username},
    {"password": req.body.password}
  ]
} ,function(err,docs){
	    console.log(docs)
     	res.json(docs)
     })
 
});

// app.post('/sendmail', function(req, res){
//     var options = {
//         auth: {
//             api_key: 'YOUR_SENDGRID_API_KEY'
//         }
//     }
//     var mailer = nodemailer.createTransport(sgTransport(options));
//     mailer.sendMail(req.body, function(error, info){
//         if(error){
//             res.status('401').json({err: info});
//         }else{
//             res.status('200').json({success: true});
//         }
//     });
// });

server.listen(3030);
console.log("server is running on port 80")

