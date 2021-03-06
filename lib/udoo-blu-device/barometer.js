var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0x87C3';
var BarometerServiceUUID = 'd77287c379c6452f994c9829da1a4229';
var PressureDataUUID = 'd7727fdf79c6452f994c9829da1a4229';
var AltitudenceDataUUID = 'd772d5aa79c6452f994c9829da1a4229';

function BarometerSensor() {
  this.sensor = new Sensor();
  this.onPressureChangeBinded = this.onPressureChange.bind(this);
};

BarometerSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

BarometerSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.sensor.writePeriodCharacteristic(udooblu, BarometerServiceUUID, period, callback);
};

BarometerSensor.prototype.enable = function (udooblu, callback) {
  this.sensor.enableConfigCharacteristic(udooblu, BarometerServiceUUID, callback);
};

BarometerSensor.prototype.disable = function (udooblu, callback) {
  this.sensor.disableConfigCharacteristic(udooblu, BarometerServiceUUID, callback);
};

BarometerSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  udooblu.readDataCharacteristic(BarometerServiceUUID, PressureDataUUID, function (error, data) {
    if (error) {
      return callback(error);
    }

    that.convertPressureData(data, function (objectPressure) {
      callback(null, objectPressure);
    }.bind(this));
  }.bind(this));
};

BarometerSensor.prototype.onPressureChange = function (data) {
  var that = this;
  this.convertPressureData(data, function (objectPressure) {
    that.sensor.emit('barometerSensorChange', objectPressure);
  }.bind(this));
};

BarometerSensor.prototype.convertPressureData = function (data, callback) {

  var low = data.readUInt16LE(0);
  var high = data.readUInt8(2);
  var value = (low | ((high & 0xF) << 16)) / 400;

  callback(value);
};

BarometerSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(BarometerServiceUUID, PressureDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }

        that.convertPressureData(data, function (objectPressure) {
          callback(null, objectPressure);
        }.bind(that));
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

BarometerSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.sensor.on('barometerSensorChange', subscribed);
      udooblu.subscribeCharacteristic(BarometerServiceUUID, PressureDataUUID, that.onPressureChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

BarometerSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.sensor.removeListener('barometerSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(BarometerServiceUUID, PressureDataUUID, this.onPressureChangeBinded, callback);
};

module.exports = BarometerSensor;
module.exports.UUIDService = UUIDService;