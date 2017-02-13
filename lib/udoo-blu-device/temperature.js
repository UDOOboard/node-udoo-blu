var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0xc065';
var TemperatureServiceUUID = 'd772c06579c6452f994c9829da1a4229';
var TemperatureDataUUID = 'd7720e2579c6452f994c9829da1a4229';

var TemperatureSensor = function (Event) {
  Sensor.call(this, Event);
  this.onTemperatureChangeBinded = this.onTemperatureChange.bind(this);
};

Util.inherits(TemperatureSensor, Sensor);

TemperatureSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

TemperatureSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.writePeriodCharacteristic(udooblu, TemperatureServiceUUID, period, callback);
};

TemperatureSensor.prototype.enable = function (udooblu, callback) {
  this.enableConfigCharacteristic(udooblu, TemperatureServiceUUID, callback);
};

TemperatureSensor.prototype.disable = function (udooblu, callback) {
  this.disableConfigCharacteristic(udooblu, TemperatureServiceUUID, callback);
};

TemperatureSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(TemperatureServiceUUID, TemperatureDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }

        that.convertTemperatureData(data, function (objectTemperature) {
          callback(null, objectTemperature);
        }.bind(that));
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

TemperatureSensor.prototype.onTemperatureChange = function (data) {
  var that = this;
  this.convertTemperatureData(data, function (objectTemperature) {
    that.emit('temperatureSensorChange', objectTemperature);
  }.bind(this));
};

TemperatureSensor.prototype.convertTemperatureData = function (data, callback) {
  var objectTemperature = (data.readInt16LE(0) >> (16 - 9)) * 0.5;
  callback(objectTemperature);
};

TemperatureSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.on('temperatureSensorChange', subscribed);
      udooblu.subscribeCharacteristic(TemperatureServiceUUID, TemperatureDataUUID, that.onTemperatureChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

TemperatureSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.removeListener('temperatureSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(TemperatureServiceUUID, TemperatureDataUUID, this.onTemperatureChangeBinded, callback);
};

module.exports = TemperatureSensor;
module.exports.UUIDService = UUIDService;