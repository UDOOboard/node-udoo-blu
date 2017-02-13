var NobleDevice = require('noble-device');

var AccelerometerSensor = require('./accelerometer');
var MagnetometerSensor = require('./magnetometer');
var GyroscopeSensor = require('./gyroscope');
var TemperatureSensor = require('./temperature');
var BarometerSensor = require('./barometer');
var AmbientLightSensor = require('./ambientLight');
var HumiditySensor = require('./humidity');
var GPIOSensor = require('./gpio');
var Sensor = require('./sensor');
var LedSensor = require('./led')
var SensorsServiceUUID = 'd7728bf379c6452f994c9829da1a4229'; //Default UUID Adv
var SensorsDataUUID = 'd772dd9179c6452f994c9829da1a4229';

var sensor = {};
var temperatureSensor = {};
var accelerometerSensor = {};
var magnetometerSensor = {};
var gyroscopeSensor = {};
var barometerSensor = {};
var ambientLightSensor = {};
var humiditySensor = {};
var gpioSensor = {};
var ledSensor = {};

var AccelerometerUUIDService = AccelerometerSensor.UUIDService;
var MagnetometerUUIDService = MagnetometerSensor.UUIDService;
var GyroscopeUUIDService = GyroscopeSensor.UUIDService;
var TemperatureUUIDService = TemperatureSensor.UUIDService;
var BarometerUUIDService = BarometerSensor.UUIDService;
var HumidityUUIDService = AmbientLightSensor.UUIDService;
var AmbientLightUUIDService = HumiditySensor.UUIDService;
var GPIOUUIDService = GPIOSensor.UUIDService;

var sensors = {};

var UDOOBlu = function (peripheral) {
  NobleDevice.call(this, peripheral);
  accelerometerSensor = new AccelerometerSensor(this.EventEmitter);
  magnetometerSensor = new MagnetometerSensor(this.EventEmitter);
  gyroscopeSensor = new GyroscopeSensor(this.EventEmitter);
  temperatureSensor = new TemperatureSensor(this.EventEmitter);
  barometerSensor = new BarometerSensor(this.EventEmitter);
  ambientLightSensor = new AmbientLightSensor(this.EventEmitter);
  humiditySensor = new HumiditySensor(this.EventEmitter);
  gpioSensor = new GPIOSensor(this.EventEmitter);
  sensor = new Sensor(this);
  ledSensor = new LedSensor(this.EventEmitter);
  this.IOPIN = gpioSensor.IOPIN;
  this.IOPINMODE = gpioSensor.IOPINMODE;
  this.IOPINVALUE = gpioSensor.IOPINVALUE;
  this.GPIO = gpioSensor.GPIO;
  this.LED = ledSensor.LED;
  this.LEDSTATE = ledSensor.LEDSTATE;

  sensors[AccelerometerUUIDService] = false;
  sensors[MagnetometerUUIDService] = false;
  sensors[GyroscopeUUIDService] = false;
  sensors[TemperatureUUIDService] = false;
  sensors[BarometerUUIDService] = false;
  sensors[HumidityUUIDService] = false;
  sensors[AmbientLightUUIDService] = false;
  sensors[GPIOUUIDService] = false;
};

UDOOBlu.SCAN_UUIDS = [SensorsServiceUUID];

NobleDevice.Util.inherits(UDOOBlu, NobleDevice);
NobleDevice.Util.mixin(UDOOBlu, NobleDevice.DeviceInformationService);

/***
 * Sensor
 */
UDOOBlu.prototype.readSensors = function (callback) {
  var that = this;
  this.readDataCharacteristic(SensorsServiceUUID, SensorsDataUUID, function (error, data) {
    if (error) {
      return callback(error);
    }

    var value = data.readUInt8(0);
    var i = 0;
    for (var key in sensors) {
      sensors[key] = ((value >> i) & 1) == 1;
      i++;
    }
    callback(null, sensors);
  }.bind(this));
};

/***
 * TemperatureSensor
 */
UDOOBlu.prototype.enableTemperature = function (callback) {
  temperatureSensor.enable(this, callback);
};

UDOOBlu.prototype.disableTemperature = function (callback) {
  temperatureSensor.disable(this, callback);
};

UDOOBlu.prototype.readTemperature = function (callback) {
  temperatureSensor.read(this, callback);
};

UDOOBlu.prototype.setTemperaturePeriod = function (period, callback) {
  temperatureSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeTemperature = function (callback, subscribed) {
  temperatureSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeTemperature = function (callback, subscribed) {
  temperatureSensor.unsubscribe(this, callback, subscribed);
}


/***
 * AccelerometerSensor
 */
UDOOBlu.prototype.enableAccelerometer = function (callback) {
  accelerometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableAccelerometer = function (callback) {
  accelerometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readAccelerometer = function (callback) {
  accelerometerSensor.read(this, callback);
};

UDOOBlu.prototype.setAccelerometerPeriod = function (period, callback) {
  accelerometerSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeAccelerometer = function (callback, subscribed) {
  accelerometerSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeAccelerometer = function (callback, subscribed) {
  accelerometerSensor.unsubscribe(this, callback, subscribed);
}

/***
 * MagnetometerSensor
 */
UDOOBlu.prototype.enableMagnetometer = function (callback) {
  magnetometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableMagnetometer = function (callback) {
  magnetometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readMagnetometer = function (callback) {
  magnetometerSensor.read(this, callback);
};

UDOOBlu.prototype.setMagnetometerPeriod = function (period, callback) {
  magnetometerSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeMagnetometer = function (callback, subscribed) {
  magnetometerSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeMagnetometer = function (callback, subscribed) {
  magnetometerSensor.unsubscribe(this, callback, subscribed);
}

/***
 * GyroscopeSensor
 */
UDOOBlu.prototype.enableGyroscope = function (callback) {
  gyroscopeSensor.enable(this, callback);
};

UDOOBlu.prototype.disableGyroscope = function (callback) {
  gyroscopeSensor.disable(this, callback);
};

UDOOBlu.prototype.readGyroscope = function (callback) {
  gyroscopeSensor.read(this, callback);
};

UDOOBlu.prototype.setGyroscopePeriod = function (period, callback) {
  gyroscopeSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeGyroscope = function (callback, subscribed) {
  gyroscopeSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeGyroscope = function (callback, subscribed) {
  gyroscopeSensor.unsubscribe(this, callback, subscribed);
}

/***
 * BarometerSensor
 */
UDOOBlu.prototype.enableBarometer = function (callback) {
  barometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableBarometer = function (callback) {
  barometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readBarometer = function (callback) {
  barometerSensor.read(this, callback);
};

UDOOBlu.prototype.setBarometerPeriod = function (period, callback) {
  barometerSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeBarometer = function (callback, subscribed) {
  barometerSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeBarometer = function (callback, subscribed) {
  barometerSensor.unsubscribe(this, callback, subscribed);
}

/***
 * AmbientLightSensor
 */
UDOOBlu.prototype.enableAmbientLight = function (callback) {
  ambientLightSensor.enable(this, callback);
};

UDOOBlu.prototype.disableAmbientLight = function (callback) {
  ambientLightSensor.disable(this, callback);
};

UDOOBlu.prototype.readAmbientLight = function (callback) {
  ambientLightSensor.read(this, callback);
};

UDOOBlu.prototype.setAmbientLightPeriod = function (period, callback) {
  ambientLightSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeAmbientLight = function (callback, subscribed) {
  ambientLightSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeAmbientLight = function (callback, subscribed) {
  ambientLightSensor.unsubscribe(this, callback, subscribed);
}

/***
 * HumiditySensor
 */
UDOOBlu.prototype.enableHumidity = function (callback) {
  humiditySensor.enable(this, callback);
};

UDOOBlu.prototype.disableHumidity = function (callback) {
  humiditySensor.disable(this, callback);
};

UDOOBlu.prototype.readHumidity = function (callback) {
  humiditySensor.read(this, callback);
};

UDOOBlu.prototype.setHumidityPeriod = function (period, callback) {
  humiditySensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeHumidity = function (callback, subscribed) {
  humiditySensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeHumidity = function (callback, subscribed) {
  humiditySensor.unsubscribe(this, callback, subscribed);
}

/***
 * GPIOSensor
 */;
UDOOBlu.prototype.setGPIOPeriod = function (period, callback) {
  gpioSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.setPinMode = function (gpios, callback) {
  gpioSensor.setPinMode(this, gpios, callback);
}

UDOOBlu.prototype.setAnalogPwmIndex = function (iopin, callback) {
  gpioSensor.setAnalogPwmIndex(this, iopin, callback);
}

UDOOBlu.prototype.readDigital = function (callback) {
  gpioSensor.readDigital(this, callback);
}

UDOOBlu.prototype.readAnalog = function (iopin, callback) {
  gpioSensor.readAnalog(this, iopin, callback);
}

UDOOBlu.prototype.subscribeAnalog = function (iopin, callback, subscribed) {
  gpioSensor.subscribeAnalog(this, iopin, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeAnalog = function (callback, subscribed) {
  gpioSensor.unsubscribeAnalog(this, callback, subscribed);
}


UDOOBlu.prototype.subscribeDigital = function (callback, subscribed) {
  gpioSensor.subscribeDigital(this, callback, subscribed);
}

UDOOBlu.prototype.subscribeDigitalPin = function (iopin, callback, subscribed) {
  gpioSensor.subscribePinDigital(this, iopin, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeDigital = function (callback, subscribed) {
  gpioSensor.unsubscribeDigital(this, callback, subscribed);
}

UDOOBlu.prototype.writeDigital = function (gpios, callback) {
  gpioSensor.writeDigital(this, gpios, callback);
}

UDOOBlu.prototype.setPwm = function (freq, cycle, iopin, callback) {
  gpioSensor.setPwm(this, freq, cycle, iopin, callback);
}

UDOOBlu.prototype.setLed = function (led, state, callback) {
  ledSensor.setLed(this, led, state, callback);
}

module.exports = UDOOBlu;
module.exports.AccelerometerUUIDService = AccelerometerUUIDService;
module.exports.MagnetometerUUIDService = MagnetometerUUIDService;
module.exports.GyroscopeUUIDService = GyroscopeUUIDService;
module.exports.TemperatureUUIDService = TemperatureUUIDService;
module.exports.BarometerUUIDService = BarometerUUIDService;
module.exports.HumidityUUIDService = HumidityUUIDService;
module.exports.AmbientLightUUIDService = AmbientLightUUIDService;
module.exports.GPIOUUIDService = GPIOUUIDService;