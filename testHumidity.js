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
    testHumidity(blus['247189cd0703']);
}, 12000);


function testHumidity(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('readHumidity');
            udoobludevice.readHumidity(function (error, objectHumidity) {
                console.log('\tobject humidity = %d', objectHumidity);
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {

            var subscribeHumidity = function (objectHumidity) {
               console.log('\tobject Humidity = %d', objectHumidity);
            };

            console.log('setHumiditySensorChangePeriod');
            udoobludevice.setHumidityPeriod(500, function (error) {
                console.log('subscribeHumidity');
                udoobludevice.subscribeHumidity(function (error) {
                    setTimeout(function () {
                        console.log('unsubscribeHumidity');
                        udoobludevice.unsubscribeHumidity(callback, subscribeHumidity);
                    }, 20000);
                }, subscribeHumidity);
            });
        }
    ]);
}