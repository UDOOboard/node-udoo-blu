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
    testLed(blus['247189cd0706']);
}, 12000);

function testLed(udoobludevice) {
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