var BluManager = require('./lib/udoo-blu-device');
var async = require('async');

var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    console.log('dd ', blu_per.id);
    blus[blu_per.id] = blu_per;
}

bluManager.on('bluDiscover', bluDiscoverCallback);

setTimeout(function () {
    testAccelerometer(blus['247189cd0703']);
}, 12000);


bluManager.scan();

function testAccelerometer(udoobludevice) {

    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('readAccelerometer');
            udoobludevice.readAccelerometer(function (error, obj) {
                if (error) {
                    console.log('object accelerometer ' + error);
                }
                else {
                    console.log('object accelerometer = %d %d %d ', obj.x, obj.y, obj.z);
                    callback();
                }
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var subscribeAccelerometer = function (obj) {
                console.log(' accelerometer = x %d y %d z %d ', obj.x, obj.y, obj.z);
            };

            console.log('setAccelerometerSensorChangePeriod');
            udoobludevice.setAccelerometerPeriod(500, function (error) {
                console.log('notifyAccelerometer');
                udoobludevice.subscribeAccelerometer(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyAccelerometer');
                        udoobludevice.unsubscribeAccelerometer(function(error){
                            
                        }, subscribeAccelerometer);
                    }, 5000);
                }, subscribeAccelerometer);
            });
        }
    ]);
}