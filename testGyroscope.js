var BluManager = require('./lib/udoo-blu-device');
var async = require('async');

console.log('--------START-------');


var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    console.log('dd ', blu_per.id);
    blus[blu_per.id] = blu_per;
    if (blu_per.id === '247189cd0706') {
        setTimeout(function () {
            testGyroscope(blu_per);
        }, 12000);
    }
}

bluManager.on('bluDiscover', bluDiscoverCallback);

bluManager.scan();

function testGyroscope(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('readGyroscope');
            udoobludevice.readGyroscope(function (error, obj) {
                console.log('\tobject gyroscope = x %d y %d z %d ', obj.x, obj.y, obj.z);
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {

            var subscribeGyroscope = function (obj) {
                console.log('\ gyroscope = x%d y%d z%d ', obj.x, obj.y, obj.z);
            };

            console.log('setGyroscopeSensorChangePeriod');
            udoobludevice.setGyroscopePeriod(500, function (error) {
                console.log('notifyGyroscope');
                udoobludevice.subscribeGyroscope(function (error) {
                    setTimeout(function () {
                        console.log('unnotifyGyroscope');
                        udoobludevice.unsubscribeGyroscope(callback, subscribeGyroscope);
                    }, 5000);
                }, subscribeGyroscope);
            });
        }
    ]);
}