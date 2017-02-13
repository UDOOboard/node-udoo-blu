var Sensor = require('./sensor');
var Util = require('util');

var UUIDService = '0x5A60';
var GyroscopeServideUUID = 'd7725a6079c6452f994c9829da1a4229';
var GyroscopeDataUUID = 'd772ff5879c6452f994c9829da1a4229';
var async = require('async');

var GyroscopeSensor = function (Event) {
  Sensor.call(this, Event);
  this.onGyroscopeSensorChangeBinded = this.onGyroscopeSensorChange.bind(this);
};
Util.inherits(GyroscopeSensor, Sensor);

GyroscopeSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

GyroscopeSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.writePeriodCharacteristic(udooblu, GyroscopeServideUUID, period, callback);
};

GyroscopeSensor.prototype.enable = function (udooblu, callback) {
  this.enableConfigCharacteristic(udooblu, GyroscopeServideUUID, callback);
};

GyroscopeSensor.prototype.disable = function (udooblu, callback) {
  this.disableConfigCharacteristic(udooblu, GyroscopeServideUUID, callback);
};

GyroscopeSensor.prototype.onGyroscopeSensorChange = function (data) {
  var that = this;
  this.convertGyroscopeSensorData(data, function (obj) {
    that.emit('gyroscopeSensorChange', obj);
  }.bind(this));
};

GyroscopeSensor.prototype.convertGyroscopeSensorData = function (data, callback) {
  scale = 500.0 / 65536.0

  var obj = {};
  obj.x = data.readInt16LE(0) * scale;
  obj.y = data.readInt16LE(2) * scale;
  obj.z = data.readInt16LE(4) * scale;

  callback(obj);
};

GyroscopeSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(GyroscopeServideUUID, GyroscopeDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }
        this.convertGyroscopeSensorData(data, function (obj) {
          callback(null, obj);
        }.bind(that));
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

GyroscopeSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.on('gyroscopeSensorChange', subscribed);
      udooblu.subscribeCharacteristic(GyroscopeServideUUID, GyroscopeDataUUID, that.onGyroscopeSensorChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

GyroscopeSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.removeListener('gyroscopeSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(GyroscopeServideUUID, GyroscopeDataUUID, this.onGyroscopeSensorChangeBinded, callback);
};

module.exports = GyroscopeSensor;
module.exports.UUIDService = UUIDService;