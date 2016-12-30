var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    bodyParser = require('body-parser');

var app = express();

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
io = io.listen(3000);

io.set('authorization', function(handshakeData, callback) {
    if (handshakeData.xdomain) {
        callback('Cross-domain connections are not allowed');
    } else {
        callback(null, true);
    }
});

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function(socket) {
    // console.log(socket);
  process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));
    });
    socket.on('message', function(message) {
	ip = socket.request.connection.remoteAddress;;
        console.log("Got message: " + message + " from: " + ip);
        io.sockets.emit('pageview', {
            'url': message
        });
    });

});
