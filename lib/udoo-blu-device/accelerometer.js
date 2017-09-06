var Sensor = require('./sensor');
var async = require('async');

var UUIDService = '0x8CEB';
var AccelerometerServiceUUID            = 'd7728ceb79c6452f994c9829da1a4229';
var AccelerometereDataUUID              = 'd772968479c6452f994c9829da1a4229';
var AccelerometerDetectionTypeUUID      = 'd772ae5c79c6452f994c9829da1a4229';
var AccelerometereDetectionFlagsUUID    = 'd772810979c6452f994c9829da1a4229';
var AccelerometerDetectionThresholdUUID = 'd772479d79c6452f994c9829da1a4229';
var AccelerometerReferenceValuesUUID    = 'd772e5db79c6452f994c9829da1a4229';

function AccelerometerSensor () {
  this.sensor = new Sensor();
  this.onAccelerometerSensorChangeBinded = this.onAccelerometerSensorChange.bind(this);
}


AccelerometerSensor.prototype.getUUIDService = function () {
  return UUIDService;
};

AccelerometerSensor.prototype.setPeriod = function (udooblu, period, callback) {
  this.sensor.writePeriodCharacteristic(udooblu, AccelerometerServiceUUID, period, callback);
};

AccelerometerSensor.prototype.enable = function (udooblu, callback) {
  this.sensor.enableConfigCharacteristic(udooblu, AccelerometerServiceUUID, callback);
};

AccelerometerSensor.prototype.disable = function (udooblu, callback) {
  this.sensor.disableConfigCharacteristic(udooblu, AccelerometerServiceUUID, callback);
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
    that.sensor.emit('accelerometerSensorChange', obj);
  }.bind(that));
};

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
      that.sensor.on('accelerometerSensorChange', subscribed);
      udooblu.subscribeCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, that.onAccelerometerSensorChangeBinded, callback);
    }], function (err) {
      if (err) {
        callback(err);
      }
    });
};

AccelerometerSensor.prototype.unsubscribe = function (udooblu, callback, subscribed) {
  this.sensor.removeListener('accelerometerSensorChange', subscribed);
  udooblu.unsubscribeCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, this.onAccelerometerSensorChangeBinded, callback);
};

AccelerometerSensor.prototype.subscribeDetectionAccLin = function (udooblu, xEnable, yEnable, zEnable, threshold, callback, subscribed) {
    this.idx = udooblu.id;
    var that = this;
    var dtFlags = 0;
    if(xEnable) dtFlags = 0x04;
    if(yEnable) dtFlags += 0x08;
    if(zEnable) dtFlags += 0x10;

    async.series([
        function (asyncCallback) {
            that.enable(udooblu, asyncCallback);
        },
        function (asyncCallback) {
            that.sensor.forcePeriodToZero(udooblu, AccelerometerServiceUUID, asyncCallback)
        },
        function (asyncCallback) {
            udooblu.writeUInt8Characteristic(AccelerometerServiceUUID, AccelerometerDetectionTypeUUID, 0x01, asyncCallback);
        },
        function (asyncCallback) {
            udooblu.writeUInt8Characteristic(AccelerometerServiceUUID, AccelerometereDetectionFlagsUUID, dtFlags, asyncCallback);
        },
        function (asyncCallback) {
            udooblu.writeUInt16LECharacteristic(AccelerometerServiceUUID, AccelerometerDetectionThresholdUUID, threshold, asyncCallback);
        },
        function (asyncCallback) {
            that.sensor.on('accelerometerSensorChange', subscribed);
            udooblu.subscribeCharacteristic(AccelerometerServiceUUID, AccelerometereDataUUID, that.onAccelerometerSensorChangeBinded, callback);
        }], function (err) {
        if (err) {
            callback(err);
        }
    });
};

AccelerometerSensor.prototype.unsubscribeDetectionAccLin = function (udooblu, callback, subscribed) {
    this.idx = udooblu.id;
    var that = this;

    async.series([
        function (asyncCallback) {
            udooblu.writeUInt8Characteristic(AccelerometerServiceUUID, AccelerometerDetectionTypeUUID, 0x00, asyncCallback);
        },
        function (asyncCallback) {
            that.unsubscribe(udooblu, callback, subscribed);
        }], function (err) {
        if (err) {
            callback(err);
        }
    });
};

module.exports = AccelerometerSensor;
module.exports.UUIDService = UUIDService;
