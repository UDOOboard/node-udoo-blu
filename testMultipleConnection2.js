var BluManager = require('./lib/udoo-blu-device');
var UDOOBluDevice = require('./lib/udoo-blu-device/blu');
var async = require('async');

// UDOOBlu.scan();

var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    console.log('dd ', blu_per.id);
    blus[blu_per.id] = blu_per;
}

bluManager.on('bluDiscover', bluDiscoverCallback);

// blu.on('bluConnectAndSetup', bluConnectAndSetupCallback);

setTimeout(function () {
    connect23(blus['b0b448c3b181']);
}, 12000);

setTimeout(function () {
    connect23(blus['247189cd0384']);
}, 15000);


bluManager.scan();

function connect2(deviceId) {
    if (deviceId === '247189cd0384') {
        readTemp(deviceId);
    } else if (deviceId.id === 'b0b448c3b181') {
        led2(deviceId);
    }
}

function connect23(deviceId) {
    readAcc(deviceId);
}

function led1(device) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 3000);
        },
        function (callback) {
            console.log('set led yellow ' + device.id);
            device.setLed(device.LED.YELLOW, device.LEDSTATE.ON, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },

    ]);
}

function led2(device) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 3000);
        },
        function (callback) {
            console.log('set led red ' + device.id);
            device.setLed(device.LED.RED, device.LEDSTATE.ON, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },

    ]);
}

function readTemp(udoobludeviceId) {

    async.series([
        function (callback) {
            udoobludevice = blus[udoobludeviceId];
            udoobludevice.connectAndSetUp(function (error) {
                if (error) {
                    console.log('log', error);
                } else {
                    callback();
                }
            });
        }, function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            udoobludevice = blus[udoobludeviceId];

            udoobludevice.enableTemperature(function (error) {
                if (error) {
                    console.log('log', error);
                } else {
                    callback();
                }
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {

            udoobludevice = blus[udoobludeviceId];
            udoobludevice.readTemperature(function (error, objectTemperature) {
                console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                callback();
            });
        }, function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            console.log('readTemperature');
            udoobludevice = blus[udoobludeviceId];
            udoobludevice.readTemperature(function (error, objectTemperature) {
                console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                callback();
            });
        }]);
}

function readAcc(udoobludevice) {
    async.series([
        function (callback) {
            console.log('\ connect device ' + udoobludevice.id  );
            udoobludevice.connectAndSetUp(function (error) {
                if (error) {
                    console.log('log', error);
                } else {
                    callback();
                }
            });
        }, function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            console.log('enableAccelerometer ' + udoobludevice.id);
            udoobludevice.enableAccelerometer(callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var accelerometerSensorChange = function (value) {
                // var characteristic1 = bluManager.getNoble()._characteristics['247189cd0384']['d7728ceb79c6452f994c9829da1a4229']['d772968479c6452f994c9829da1a4229'];
                // var characteristic2 = bluManager.getNoble()._characteristics['b0b448c3b181']['d7728ceb79c6452f994c9829da1a4229']['d772968479c6452f994c9829da1a4229'];
                
                // console.log('list 1 ' +characteristic1.listenerCount('data'));
                // console.log('list 2 ' +characteristic2.listenerCount('data'));


                if (udoobludevice.id != value.id) return;
                var obj = {};
                obj.value = {};

                obj.value.x = value.x.toFixed(4);
                obj.value.y = value.y.toFixed(4);
                obj.value.z = value.z.toFixed(4);

                obj.id = udoobludevice.id;
                // obj.key = data.key;


                obj.sensor = 'accelerometer';
                // socket.emit(operationEmitting(operation), obj);
            };

            var list = function (data) {

                var obj = {};
                obj.x = (data.readInt16LE(0)) / 4096.0;
                obj.y = data.readInt16LE(2) / 4096.0;
                obj.z = data.readInt16LE(4) / 4096.0;
                obj.id = this.idx;
                
                console.log(' device ' + udoobludevice.id + ' x ' + obj.x + ' y ' + obj.y + ' z ' + obj.z);
            }

            console.log('setAccelerometerSensorChangePeriod ' + udoobludevice.id);
            udoobludevice.setAccelerometerPeriod(500, function (error) {
                console.log('notifyAccelerometer ' + udoobludevice.id);
                udoobludevice.subscribeAccelerometer(function (error) {
                    var obj = {};
                    if (error) {
                        obj.err = "fail";
                        obj.sensor = 'accelerometer';
                        // obj.key = data.key;
                        // socket.emit(operationEmitting(operation), obj);
                    } else {
                        console.log('subscribedAcc');
                        var characteristic1 = bluManager.getNoble()._characteristics[ udoobludevice.id]['d7728ceb79c6452f994c9829da1a4229']['d772968479c6452f994c9829da1a4229'];
                        characteristic1.addListener('data', list);
                    }
                }, accelerometerSensorChange);
            });
        }]);
}

function getKeys(obj) {
    var keys = [];
    for (key in obj) {
        keys.push(key);
    }
    return keys;
}
