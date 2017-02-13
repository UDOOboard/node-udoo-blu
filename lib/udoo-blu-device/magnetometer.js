var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0xDD58';
var MagnetometerServideUUID = 'd772dd5879c6452f994c9829da1a4229';
var MagnetometerDataUUID = 'd7721cb379c6452f994c9829da1a4229';

var MagnetometerSensor = function (Event) {
  Sensor.call(this, Event);
  this.onMagnetometerSensorChangeBinded = this.onMagnetometerSensorChange.bind(this);
};
Util.inherits(MagnetometerSensor, Sensor);

MagnetometerSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

MagnetometerSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.writePeriodCharacteristic(udooblu, MagnetometerServideUUID, period, callback);
};

MagnetometerSensor.prototype.enable = function (udooblu, callback) {
  this.enableConfigCharacteristic(udooblu, MagnetometerServideUUID, callback);
};

MagnetometerSensor.prototype.disable = function (udooblu, callback) {
  this.disableConfigCharacteristic(udooblu, MagnetometerServideUUID, callback);
};


MagnetometerSensor.prototype.onMagnetometerSensorChange = function (data) {
  var that = this;
  this.convertMagnetometerSensorData(data, function (obj) {
    that.emit('magnetometerSensorChange', obj);
  }.bind(this));
};

MagnetometerSensor.prototype.convertMagnetometerSensorData = function (data, callback) {
  //uT

  var obj = {};

  obj.x = data.readInt16LE(0) / 10;
  obj.y = data.readInt16LE(2) / 10;
  obj.z = data.readInt16LE(4) / 10;

  callback(obj);
};

MagnetometerSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(udooblu, MagnetometerServideUUID, MagnetometerDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }

        that.convertMagnetometerSensorData(data, function (obj) {
          callback(null, obj);
        }.bind(this));
      }.bind(this));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

MagnetometerSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  var that = this;
 async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.on('magnetometerSensorChange', subscribed);
      udooblu.subscribeCharacteristic(MagnetometerServideUUID, MagnetometerDataUUID, that.onMagnetometerSensorChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

MagnetometerSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.removeListener('magnetometerSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(MagnetometerServideUUID, MagnetometerDataUUID, this.onMagnetometerSensorChangeBinded, callback);
};

module.exports = MagnetometerSensor;
module.exports.UUIDService = UUIDService;