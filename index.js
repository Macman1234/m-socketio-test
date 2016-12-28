var express = require('express'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io'),
    bodyParser = require('body-parser');

var app = express();

app.set('port', 8080);
//app.use(bodyParser);
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
    socket.on('message', function(message) {
        console.log("Got message: " + message);
        io.sockets.emit('pageview', {
            'url': message
        });
    });

});
