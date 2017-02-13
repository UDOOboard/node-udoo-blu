var BluManager = require('./lib/udoo-blu-device');
var UDOOBluDevice = require('./lib/udoo-blu-device/blu');

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
    testSensor(blus['247189cd0703']);
}, 12000);

function testSensor(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },

        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            console.log('readSensors');
            udoobludevice.readSensors(function (error, objectSensor) {
                for (var key in objectSensor) {
                    console.log(key + " : " + objectSensor[key]);
                }
            });
        },
    ]);
};