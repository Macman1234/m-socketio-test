var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();

var util = require('util');

app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
io = io.listen(server);

io.set('authorization', (handshakeData, callback) => {
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
    socket.on('message', function(message) {
        console.log("Got message: " + message);
        fs.readFile('./log.txt', (err, data) => {
            if (err) throw err;
            console.log("served data to: " + "PLACEHOLDER");
            io.sockets.emit('update', data.toString());
        });
    });
});
