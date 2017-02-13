var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0xBCBF';
var HumidityServiceUUID = 'd772bcbf79c6452f994c9829da1a4229';
var HumidityDataUUID = 'd7720ce279c6452f994c9829da1a4229';
var TemperatureDataUUID = 'd7720e2579c6452f994c9829da1a4229';

var HumiditySensor = function (Event) {
  Sensor.call(this, Event);
  this.onHumiditySensorChangeBinded = this.onHumiditySensorChange.bind(this);
};
Util.inherits(HumiditySensor, Sensor);

HumiditySensor.prototype.getUUIDService = function () {
  return UUIDService;
};

HumiditySensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.writePeriodCharacteristic(udooblu, HumidityServiceUUID, period, callback);
};

HumiditySensor.prototype.enable = function (udooblu, callback) {
  this.enableConfigCharacteristic(udooblu, HumidityServiceUUID, callback);
};

HumiditySensor.prototype.disable = function (udooblu, callback) {
  this.disableConfigCharacteristic(udooblu, HumidityServiceUUID, callback);
};

HumiditySensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(HumidityServiceUUID, HumidityDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }

        that.convertHumiditySensorData(data, function (objectHumiditySensor) {
          callback(null, objectHumiditySensor);
        }.bind(that));
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

HumiditySensor.prototype.onHumiditySensorChange = function (data) {
  var that = this;
  this.convertHumiditySensorData(data, function (objectHumiditySensor) {
    that.emit('humiditySensorChange', objectHumiditySensor);
  }.bind(this));
};

HumiditySensor.prototype.convertHumiditySensorData = function (data, callback) {
  var rawH = data.readUInt16LE(0);
  var objectHumiditySensor = -6.0 + 125.0 * (((rawH & 0xFF00)) / 65536.0)
  callback(objectHumiditySensor);
};

HumiditySensor.prototype.subscribe = function (udooblu, callback, subscribed) {
   var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.on('humiditySensorChange', subscribed);
      udooblu.subscribeCharacteristic(HumidityServiceUUID, HumidityDataUUID, that.onHumiditySensorChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

HumiditySensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.removeListener('humiditySensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(HumidityServiceUUID, HumidityDataUUID, this.onHumiditySensorChangeBinded, callback);
};

module.exports = HumiditySensor;
module.exports.UUIDService = UUIDService;