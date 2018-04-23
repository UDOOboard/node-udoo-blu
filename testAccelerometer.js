var BluManager = require('./lib/udoo-blu-device');
var async = require('async');

var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    blus[blu_per.id] = blu_per;
}

bluManager.on('bluDiscover', bluDiscoverCallback);

bluManager.on('endDiscover', function () {
    console.log(`endDiscover`);
    var blu = blus['247189cd0485'];
    if(blu) testAccelerometer(blu);
});

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
        // function (callback) {
        //     var subscribeAccelerometer = function (obj) {
        //         console.log(' accelerometer = x %d y %d z %d ', obj.x, obj.y, obj.z);
        //     };
        //
        //     console.log('setAccelerometerSensorChangePeriod');
        //     udoobludevice.setAccelerometerPeriod(500, function (error) {
        //         console.log('notifyAccelerometer');
        //         udoobludevice.subscribeAccelerometer(function (error) {
        //             setTimeout(function () {
        //                 console.log('unnotifyAccelerometer');
        //                 udoobludevice.unsubscribeAccelerometer(function(error){
        //
        //                 }, subscribeAccelerometer);
        //             }, 5000);
        //         }, subscribeAccelerometer);
        //     });
        // }
        function (callback) {
            var subscribeAccelerometer = function (obj) {
                console.log(' accelerometer = x %d y %d z %d ', obj.x, obj.y, obj.z);
                udoobludevice.setLed(1, 1);
            };

            console.log('subscribeDetectionAccLin');

            udoobludevice.subscribeDetectionAccLin(true, false, false, 300, function (error) {
                if(error) console.log(`detection sub err ${error}`);
                else console.log(`detection ok`);
                udoobludevice.setLed(0, 1);
                setTimeout(function () {
                    udoobludevice.unsubscribeDetectionAccLin(null, subscribeAccelerometer);
                }, 20000);
            }, subscribeAccelerometer);
        }
    ]);
}
