var Sensor = require('./sensor');
var Util = require('util');

var UUIDService = '0xE605';
var LedServiceUUID = 'd772e60579c6452f994c9829da1a4229';
var LedGreenUUID = 'd772cd5179c6452f994c9829da1a4229';
var LedRedUUID = 'd772aed479c6452f994c9829da1a4229';
var LedYellowUUID = 'd772db1a79c6452f994c9829da1a4229';


var LED = {
    GREEN: 0,
    YELLOW: 1,
    RED: 2
}

var LEDSTATE = {
    ON: 0,
    OFF: 1,
    BLINK: 2
}

function LedSensor() {
}

LedSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

LedSensor.prototype.LED = LED;
LedSensor.prototype.LEDSTATE = LEDSTATE;

LedSensor.prototype.setLed = function (udooblu, led, state, callback) {
    var characteristics;
    if (led === LED.GREEN) {
        characteristics = LedGreenUUID;
    } else if (led === LED.RED) {
        characteristics = LedRedUUID;
    } else if (led === LED.YELLOW) {
        characteristics = LedYellowUUID;
    }

    var value = 0;
    var interval = 0;
    if (state === LEDSTATE.ON) {
        value = 1;
        interval = 0x03;
    } else if (state === LEDSTATE.OFF) {
        value = 0;
    } else if (state === LEDSTATE.BLINK) {
        value = 1;
        interval = 0x0302;
    }

    var buffer = new Buffer(2);
    buffer.writeUInt8(value, 0);
    buffer.writeUInt8(interval, 1);

    udooblu.writeDataCharacteristic(LedServiceUUID, characteristics, buffer, callback);
}

module.exports = LedSensor;
module.exports.UUIDService = UUIDService;