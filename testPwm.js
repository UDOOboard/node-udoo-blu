var UDOOBlu = require('./lib/udoo-blu-device/');
var async = require('async');

console.log('--------START-------');
UDOOBlu.discoverAll(function (udoobludevice) {
    console.log('found ' + udoobludevice.id);
    if (udoobludevice.id === '247189cd0384') {
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
                console.log('setPinMode');
                var gpios = [];
                console.log(udoobludevice.IOPIN.A1);
                var GPIOA0 = udoobludevice.GPIO;
                GPIOA0.iopin = udoobludevice.IOPIN.A1;
                GPIOA0.mode = udoobludevice.IOPINMODE.PWM;

                gpios[0] = GPIOA0;
                udoobludevice.setPinMode(gpios, callback);
            },
            function (callback) {
                setTimeout(callback, 2000);
            },
            function (callback) {
                console.log('setPwm');
                udoobludevice.setPwm(9888, 80, udoobludevice.IOPIN.A1, callback);
            }
        ]);
    }
});