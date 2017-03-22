var BluManager = require('./lib/udoo-blu-device');
var async = require('async');

var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    console.log('dd ', blu_per.id);
    blus[blu_per.id] = blu_per;
}

bluManager.on('bluDiscover', bluDiscoverCallback);

bluManager.scan();

setTimeout(function () {
    testMagnetometer(blus['247189cd0706']);
}, 12000);


function testMagnetometer(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },

        function (callback) {
            console.log('readMagnetometer');
            udoobludevice.readMagnetometer(function (error, obj) {
                console.log('\tobject magnetometer = %d %d %d ', obj.x, obj.y, obj.z);
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {

            var subscribeMagnetometer = function (obj) {
                console.log('\ magnetometer = x%d y%d z%d ', obj.x, obj.y, obj.z);
            };

            console.log('setMagnetometerSensorChangePeriod');
            udoobludevice.setMagnetometerPeriod(500, function (error) {
                console.log('notifyMagnetometer');
                udoobludevice.subscribeMagnetometer(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyMagnetometer');
                        udoobludevice.unsubscribeMagnetometer(callback, subscribeMagnetometer);
                    }, 5000);
                }, subscribeMagnetometer);
            });
        }
    ]);
}