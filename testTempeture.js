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
    testTemperature(blus['247189cd0703']);
}, 12000);


function testTemperature(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        }, function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            console.log('readTemperature');
            udoobludevice.readTemperature(function (error, objectTemperature) {
                console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                callback();
            });
        }, function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {

            var subscribeTemperature = function (objectTemperature) {
                console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            };

            console.log('tsetemperatureSensorChange');
            udoobludevice.setTemperaturePeriod(500, function (error) {
                console.log('notifyTemperature');
                udoobludevice.subscribeTemperature(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyAccelerometer');
                        udoobludevice.unsubscribeTemperature(callback, subscribeTemperature);
                    }, 10000);
                },subscribeTemperature);
            });
        }]);
}

