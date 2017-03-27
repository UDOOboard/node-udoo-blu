
var UUIDService = '0x8BF3';
var SensorsServiceUUID = 'd7728bf379c6452f994c9829da1a4229'; //Default UUID Adv
var SensorsEnableUUID = 'd772c04379c6452f994c9829da1a4229'; //Enable UUID for all bricks
var SensorNotificatioPeriodUUID = 'd77215f479c6452f994c9829da1a4229'; //Default Notification Period
var async = require('async');
const EventEmitter = require('events');

function Sensor () {
  this.event =  new EventEmitter();
  this.isEnable = false;
};

Sensor.prototype.getUUIDService = function () {
  return UUIDService;
};

Sensor.prototype.reset = function () {
  this.isEnable = false;
};

Sensor.prototype.emit = function (name, obj) {
  this.event.emit(name, obj);
}

Sensor.prototype.on = function (name, callback) {
  this.event.on(name, callback);
}

Sensor.prototype.removeListener = function (name, callback) {
  this.event.removeListener(name, callback);
}

Sensor.prototype.writePeriodCharacteristic = function (udooblu, serviceUuid, period, callback) {
  period /= 10; // input is scaled by units of 10ms

  if (period < 1) {
    period = 1;
  } else if (period > 600000) {
    period = 6000;
  }

  udooblu.writeUInt16LECharacteristic(serviceUuid, SensorNotificatioPeriodUUID, period, callback);
};

Sensor.prototype.enableConfigCharacteristic = function (udooblu, serviceUuid, callback) {
  var that = this;
  if (that.isEnable) {
    callback(null);
  } else {
    async.series([
      function (asyncCallback) {
        udooblu.writeUInt8Characteristic(serviceUuid, SensorsEnableUUID, 0x01, function (error) {
          if (!error) {
            that.isEnable = true;
            asyncCallback();
          }
          callback(error);
        });
      },
      function (asyncCallback) {
        setTimeout(asyncCallback, 2000);
      }], function (err) {
        if (err) {
          callback(err);
        }
      });
  }
};

Sensor.prototype.disableConfigCharacteristic = function (udooblu, serviceUuid, callback) {
  udooblu.writeUInt8Characteristic(serviceUuid, SensorsEnableUUID, 0x00, function (error) {
    if (!error) {
      this.isEnable = false;
    }
    callback(error);
  });
};

module.exports = Sensor;
module.exports.UUIDService = UUIDService;