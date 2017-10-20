
var net = require('net'),
    JsonSocket = require('json-socket');
 
var port = 9838; //The same port that the server is listening on 
var host = '127.0.0.1';
var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket 
socket.connect(port, host);
socket.on('connect', function() { //Don't send until we're connected 
   
    socket.on('message', function(data){
    	console.log(data)
    });
});