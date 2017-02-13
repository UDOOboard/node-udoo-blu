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
    testAmbientLigth(blus['247189cd0703']);
}, 12000);


function testAmbientLigth(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('readAmbientLight');
            udoobludevice.readAmbientLight(function (error, objectAmbientLight) {
                console.log('\tobject ambientLight = %d', objectAmbientLight);
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var subscribeAmbientLight = function (objectAmbientLight) {
                console.log('\tobject ambientLight = %d', objectAmbientLight);
            };

            console.log('setAmbientLightSensorChangePeriod');
            udoobludevice.setAmbientLightPeriod(500, function (error) {
                console.log('notifyAmbientLight');
                udoobludevice.subscribeAmbientLight(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyAmbientLight');
                        udoobludevice.unsubscribeAmbientLight(callback, subscribeAmbientLight);
                    }, 5000);
                }, subscribeAmbientLight);
            });
        }
    ]);
}