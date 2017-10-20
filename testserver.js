var net = require('net'),
    JsonSocket = require('json-socket');
 
var port = 9838;
var server = net.createServer();
server.listen(port);
server.on('connection', function(socket) {
    socket = new JsonSocket(socket);
  
    socket.emit('message',hi)
});