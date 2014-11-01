var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var allClients = [];
var count = 0;
var fpsPi = 0;

server.listen(3141);

server.on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, exit...');
        process.exit();
    }
});

app.get('/', function (req, res) {
  res.send('Fps is ' + fpsPi);
  console.log('requested / - show ' + fpsPi);
});

function getDate() {
    var datas = new Date();
    return datas.getHours() + ':' + datas.getMinutes() + ':' + datas.getSeconds() + '.' + datas.getMilliseconds()
}

function consolelog(msg) {
    console.log(getDate() + ' ' + msg);
}

io.on('connection', function (socket) {
    io.emit('setfps', {fps: fpsPi});
    
    // browser subscribes to listen to the station 
    socket.on('subscribe', function(data) {
        socket.json.emit('subscribed', {fps: fpsPi});
        io.emit('setfps', {fps: fpsPi});
    });
    
    // disconnect on error. Browser will reconnect
    socket.on('error', function() {
        socket.disconnect();
    });
    
    // client disconnects
    socket.on('disconnect', function() {
        consolelog('Client disconnected.');
    });
    
    // save to RPi and browsers new fps
    socket.on('setfps', function(fps){
        fpsPi = fps;
        consolelog('setfps ' + fpsPi);
        io.emit('setfps', {fps: fpsPi});
    });
});
