var Sensor = require('./sensor');
var Util = require('util');
var async = require('async');

var UUIDService = '0x8CEB';
var AccelerometerServiceUUID = 'd7728ceb79c6452f994c9829da1a4229';
var AccelerometereDataUUID = 'd772968479c6452f994c9829da1a4229';


var AccelerometerSensor = function (Event) {
  this.idx = '';
  Sensor.call(this, Event);
  this.onAccelerometerSensorChangeBinded = this.onAccelerometerSensorChange.bind(this);
};

Util.inherits(AccelerometerSensor, Sensor);

AccelerometerSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

AccelerometerSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.writePeriodCharacteristic(udooblu, AccelerometerServiceUUID, period, callback);
};

AccelerometerSensor.prototype.enable = function (udooblu, callback) {
  this.enableConfigCharacteristic(udooblu, AccelerometerServiceUUID, callback);
};

AccelerometerSensor.prototype.disable = function (udooblu, callback) {
  this.disableConfigCharacteristic(udooblu, AccelerometerServiceUUID, callback);
};

AccelerometerSensor.prototype.read = function (udooblu, callback) {
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      udooblu.readDataCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, function (error, data) {
        if (error) {
          callback(error);
        }
        else {
          that.convertAccelerometerSensorData(data, function (obj) {
            callback(null, obj);
          }.bind(that));
        }
      }.bind(that));
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

AccelerometerSensor.prototype.onAccelerometerSensorChange = function (data) {
  var that = this;
  this.convertAccelerometerSensorData(data, function (obj) {
    that.emit('accelerometerSensorChange', obj);
  }.bind(that));
}

AccelerometerSensor.prototype.convertAccelerometerSensorData = function (data, callback) {

  var obj = {};
  obj.x = data.readInt16LE(0) / 4096.0;
  obj.y = data.readInt16LE(2) / 4096.0;
  obj.z = data.readInt16LE(4) / 4096.0;
  obj.id = this.idx;

  callback(obj);
};

AccelerometerSensor.prototype.subscribe = function (udooblu, callback, subscribed) {
  this.idx = udooblu.id;
  var that = this;
  async.series([
    function (asyncCallback) {
      that.enable(udooblu, asyncCallback);
    },
    function (asyncCallback) {
      that.on('accelerometerSensorChange', subscribed);
      udooblu.subscribeCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, that.onAccelerometerSensorChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};


AccelerometerSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.removeListener('accelerometerSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, this.onAccelerometerSensorChangeBinded, callback);
};

module.exports = AccelerometerSensor;
module.exports.UUIDService = UUIDService;
