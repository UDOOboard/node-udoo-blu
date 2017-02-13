var UDOOBlu = require('./lib/udoo-blu-device/');
var async = require('async');

console.log('--------START-------');
UDOOBlu.discoverAll(function (udoobludevice) {
    console.log('found ' + udoobludevice.id);

    if (udoobludevice.id === 'b0b448c3b181') {
        udoobludevice.on('disconnect', function (data) {
            console.log('disconnected!' + data);
            process.exit(0);
        });

        udoobludevice.on('disconnect', function () {
            console.log('disconnected!');
            process.exit(0);
        });

        async.series([
            function (callback) {
                console.log('connectAndSetUp');
                udoobludevice.connectAndSetUp(callback);
            },
             function (callback) {
                setTimeout(callback, 2000);
            },
            function (callback) {
                console.log('set led');
                udoobludevice.setLed(udoobludevice.LED.YELLOW, udoobludevice.LEDSTATE.ON, callback);
            },
            function (callback) {
                setTimeout(callback, 2000);
            },
        
        ]);
    }
});