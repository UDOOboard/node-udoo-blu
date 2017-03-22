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
    testBarometer(blus['247189cd0706']);
}, 12000);


function testBarometer(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('readBarometer');
            udoobludevice.readBarometer(function (error, objectBarometer) {
                console.log('\tobject barometer = ', objectBarometer.toFixed(2));
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var subscribeBarometer = function (objectBarometer) {
                console.log('\tobject barometer = ', objectBarometer.toFixed(2));
            };

            console.log('setBarometerSensorChangePeriod');
            udoobludevice.setBarometerPeriod(500, function (error) {
                console.log('notifyBarometer');
                udoobludevice.subscribeBarometer(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyBarometer');
                        udoobludevice.unsubscribeBarometer(callback, subscribeBarometer);
                    }, 5000);
                }, subscribeBarometer);
            });
        }
    ]);
}