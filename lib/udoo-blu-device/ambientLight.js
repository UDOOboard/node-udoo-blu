var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0xAA45';
var AmbientLightServiceUUID = 'd772aa4579c6452f994c9829da1a4229';
var AmbientLightDataUUID = 'd77296a279c6452f994c9829da1a4229';

function AmbientLightSensor() {
  this.sensor = new Sensor();
  this.onAmbientLightChangeBinded = this.onAmbientLightChange.bind(this);
};

AmbientLightSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

AmbientLightSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.sensor.writePeriodCharacteristic(udooblu, AmbientLightServiceUUID, period, callback);
};

AmbientLightSensor.prototype.enable = function (udooblu, callback) {
  this.sensor.enableConfigCharacteristic(udooblu, AmbientLightServiceUUID, callback);
};

AmbientLightSensor.prototype.disable = function (udooblu, callback) {
  this.sensor.disableConfigCharacteristic(udooblu, AmbientLightSensorServiceUUID, callback);
};

AmbientLightSensor.prototype.onAmbientLightChange = function (data) {
  var that = this;
  this.convertAmbientLightSensorData(data, function (objectAmbientLightSensor) {
    that.sensor.emit('ambientLightSensorChange', objectAmbientLightSensor);
  }.bind(this));
};

AmbientLightSensor.prototype.convertAmbientLightSensorData = function (data, callback) {
  var objectAmbientLightSensor = data.readUInt16LE(0);
  callback(objectAmbientLightSensor);
};

AmbientLightSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(AmbientLightServiceUUID, AmbientLightDataUUID, function (error, data) {
        if (error) {
          return callback(error);
        }
        that.convertAmbientLightSensorData(data, function (objectAmbientLightSensor) {
          callback(null, objectAmbientLightSensor);
        }.bind(that));
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

AmbientLightSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.sensor.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.sensor.on('ambientLightSensorChange', subscribed);
      udooblu.subscribeCharacteristic(AmbientLightServiceUUID, AmbientLightDataUUID, that.onAmbientLightChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

AmbientLightSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.sensor.removeListener('ambientLightSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(AmbientLightServiceUUID, AmbientLightDataUUID, this.onAmbientLightChangeBinded, callback);
};

module.exports = AmbientLightSensor;
module.exports.UUIDService = UUIDService;