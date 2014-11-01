var socket = require('socket.io-client')('http://bk-it.ru:3141');
var gpio = require('rpi-gpio');
var fs = require('fs');

// hack due to error
fs.exists = require('path').exists;
var async = require('async');

// pin GPIO4
var pin = 7;

// current fps
var piFps = 0;
var currentValue = false;
var timemanager;


var set0 = function(err, results) {
    if (err)
        console.log(err);
    console.log('Pin ' + pin + ' closed');
    directWrite(pin, false, function() {
        clearTimeout(timemanager);
    });
};

var stopblink = true;

var blinkexec = function() {
    delayedWrite(7, true, function() {
        delayedWrite(7, false, blinkexec)
    });
};

var blink = function(err, results) {
    if (err)
        console.log(err);
    console.log('Pin ' + pin + ' blinking');
    blinkexec();
};


function directWrite(pin, value, callback) {
    return gpio.write(pin, value, callback);

}
function delayedWrite(pin, value, callback) {
    var delay = Math.round(1000 / piFps / 2);
    
    clearTimeout(timemanager);
    timemanager = setTimeout(function() {
        directWrite(pin, value, callback);
    }, delay);
}


var release = function() {
    console.log('Writes complete, pause then unexport pins');
    setTimeout(function() {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
            return process.exit(0);
        });
    }, 500);
};


socket.on('connect', function() {
    console.log('connected');
    
    socket.on('setfps', function(data) {
        console.log(data);
        
        if (data.fps > 0) {
            piFps = data.fps;
            gpio.setup(pin, gpio.DIR_OUT, blink);
        } else {
            gpio.setup(pin, gpio.DIR_OUT, set0);
        }
    });
    
    socket.on('disconnect', function() {
        console.log('disconnect');
        release();
    });
});
