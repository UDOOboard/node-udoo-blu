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
var LedSensor = require('./led');
var SensorsServiceUUID = 'd7728bf379c6452f994c9829da1a4229'; //Default UUID Adv
var SensorsDataUUID = 'd772dd9179c6452f994c9829da1a4229';

var AccelerometerUUIDService = AccelerometerSensor.UUIDService;
var MagnetometerUUIDService = MagnetometerSensor.UUIDService;
var GyroscopeUUIDService = GyroscopeSensor.UUIDService;
var TemperatureUUIDService = TemperatureSensor.UUIDService;
var BarometerUUIDService = BarometerSensor.UUIDService;
var HumidityUUIDService = AmbientLightSensor.UUIDService;
var AmbientLightUUIDService = HumiditySensor.UUIDService;
var GPIOUUIDService = GPIOSensor.UUIDService;

function UDOOBlu(peripheral) {
  NobleDevice.call(this, peripheral);
  this.accelerometerSensor = new AccelerometerSensor();
  this.magnetometerSensor = new MagnetometerSensor();
  this.gyroscopeSensor = new GyroscopeSensor();
  this.temperatureSensor = new TemperatureSensor();
  this.barometerSensor = new BarometerSensor();
  this.ambientLightSensor = new AmbientLightSensor();
  this.humiditySensor = new HumiditySensor();
  this.gpioSensor = new GPIOSensor();
  this.sensor = new Sensor();
  this.ledSensor = new LedSensor();
  this.IOPIN = this.gpioSensor.IOPIN;
  this.IOPINMODE = this.gpioSensor.IOPINMODE;
  this.IOPINVALUE = this.gpioSensor.IOPINVALUE;
  this.GPIO = this.gpioSensor.GPIO;
  this.LED = this.ledSensor.LED;
  this.LEDSTATE = this.ledSensor.LEDSTATE;
  
  this.sensors = {};
  this.sensors[AccelerometerUUIDService] = false;
  this.sensors[MagnetometerUUIDService] = false;
  this.sensors[GyroscopeUUIDService] = false;
  this.sensors[TemperatureUUIDService] = false;
  this.sensors[BarometerUUIDService] = false;
  this.sensors[HumidityUUIDService] = false;
  this.sensors[AmbientLightUUIDService] = false;
  this.sensors[GPIOUUIDService] = false;
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
    for (var key in that.sensors) {
      that.sensors[key] = ((value >> i) & 1) == 1;
      i++;
    }
    callback(null, that.sensors);
  }.bind(this));
};

/***
 * TemperatureSensor
 */
UDOOBlu.prototype.enableTemperature = function (callback) {
  this.temperatureSensor.enable(this, callback);
};

UDOOBlu.prototype.disableTemperature = function (callback) {
  this.temperatureSensor.disable(this, callback);
};

UDOOBlu.prototype.readTemperature = function (callback) {
  this.temperatureSensor.read(this, callback);
};

UDOOBlu.prototype.setTemperaturePeriod = function (period, callback) {
  this.temperatureSensor.setPeriod(this, period, callback);
};

UDOOBlu.prototype.subscribeTemperature = function (callback, subscribed) {
  this.temperatureSensor.subscribe(this, callback, subscribed);
};

UDOOBlu.prototype.unsubscribeTemperature = function (callback, subscribed) {
  this.temperatureSensor.unsubscribe(this, callback, subscribed);
};


/***
 * AccelerometerSensor
 */
UDOOBlu.prototype.enableAccelerometer = function (callback) {
  this.accelerometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableAccelerometer = function (callback) {
  this.accelerometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readAccelerometer = function (callback) {
  this.accelerometerSensor.read(this, callback);
};

UDOOBlu.prototype.setAccelerometerPeriod = function (period, callback) {
  this.accelerometerSensor.setPeriod(this, period, callback);
};

UDOOBlu.prototype.subscribeAccelerometer = function (callback, subscribed) {
  this.accelerometerSensor.subscribe(this, callback, subscribed);
};

UDOOBlu.prototype.unsubscribeAccelerometer = function (callback, subscribed) {
  this.accelerometerSensor.unsubscribe(this, callback, subscribed);
};

UDOOBlu.prototype.subscribeDetectionAccLin = function (xEnable, yEnable, zEnable, threshold, callback, subscribed) {
    this.accelerometerSensor.subscribeDetectionAccLin(this, xEnable, yEnable, zEnable, threshold, callback, subscribed);
};

UDOOBlu.prototype.unsubscribeDetectionAccLin = function (callback, subscribed) {
    this.accelerometerSensor.unsubscribeDetectionAccLin(this, callback, subscribed);
};

/***
 * MagnetometerSensor
 */
UDOOBlu.prototype.enableMagnetometer = function (callback) {
  this.magnetometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableMagnetometer = function (callback) {
  this.magnetometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readMagnetometer = function (callback) {
  this.magnetometerSensor.read(this, callback);
};

UDOOBlu.prototype.setMagnetometerPeriod = function (period, callback) {
  this.magnetometerSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeMagnetometer = function (callback, subscribed) {
  this.magnetometerSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeMagnetometer = function (callback, subscribed) {
  this.magnetometerSensor.unsubscribe(this, callback, subscribed);
}

/***
 * GyroscopeSensor
 */
UDOOBlu.prototype.enableGyroscope = function (callback) {
  this.gyroscopeSensor.enable(this, callback);
};

UDOOBlu.prototype.disableGyroscope = function (callback) {
  this.gyroscopeSensor.disable(this, callback);
};

UDOOBlu.prototype.readGyroscope = function (callback) {
  this.gyroscopeSensor.read(this, callback);
};

UDOOBlu.prototype.setGyroscopePeriod = function (period, callback) {
  this.gyroscopeSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeGyroscope = function (callback, subscribed) {
  this.gyroscopeSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeGyroscope = function (callback, subscribed) {
  this.gyroscopeSensor.unsubscribe(this, callback, subscribed);
}

/***
 * BarometerSensor
 */
UDOOBlu.prototype.enableBarometer = function (callback) {
  this.barometerSensor.enable(this, callback);
};

UDOOBlu.prototype.disableBarometer = function (callback) {
  this.barometerSensor.disable(this, callback);
};

UDOOBlu.prototype.readBarometer = function (callback) {
  this.barometerSensor.read(this, callback);
};

UDOOBlu.prototype.setBarometerPeriod = function (period, callback) {
  this.barometerSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeBarometer = function (callback, subscribed) {
  this.barometerSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeBarometer = function (callback, subscribed) {
  this.barometerSensor.unsubscribe(this, callback, subscribed);
}

/***
 * AmbientLightSensor
 */
UDOOBlu.prototype.enableAmbientLight = function (callback) {
  this.ambientLightSensor.enable(this, callback);
};

UDOOBlu.prototype.disableAmbientLight = function (callback) {
  this.ambientLightSensor.disable(this, callback);
};

UDOOBlu.prototype.readAmbientLight = function (callback) {
  this.ambientLightSensor.read(this, callback);
};

UDOOBlu.prototype.setAmbientLightPeriod = function (period, callback) {
  this.ambientLightSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeAmbientLight = function (callback, subscribed) {
  this.ambientLightSensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeAmbientLight = function (callback, subscribed) {
  this.ambientLightSensor.unsubscribe(this, callback, subscribed);
}

/***
 * HumiditySensor
 */
UDOOBlu.prototype.enableHumidity = function (callback) {
  this.humiditySensor.enable(this, callback);
};

UDOOBlu.prototype.disableHumidity = function (callback) {
  this.humiditySensor.disable(this, callback);
};

UDOOBlu.prototype.readHumidity = function (callback) {
  this.humiditySensor.read(this, callback);
};

UDOOBlu.prototype.setHumidityPeriod = function (period, callback) {
  this.humiditySensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.subscribeHumidity = function (callback, subscribed) {
  this.humiditySensor.subscribe(this, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeHumidity = function (callback, subscribed) {
  this.humiditySensor.unsubscribe(this, callback, subscribed);
}

/***
 * GPIOSensor
 */;
UDOOBlu.prototype.setGPIOPeriod = function (period, callback) {
  this.gpioSensor.setPeriod(this, period, callback);
}

UDOOBlu.prototype.setPinMode = function (gpios, callback) {
  this.gpioSensor.setPinMode(this, gpios, callback);
}

UDOOBlu.prototype.setAnalogPwmIndex = function (iopin, callback) {
  this.gpioSensor.setAnalogPwmIndex(this, iopin, callback);
}

UDOOBlu.prototype.readDigital = function (callback) {
  this.gpioSensor.readDigital(this, callback);
}

UDOOBlu.prototype.readAnalog = function (iopin, callback) {
  this.gpioSensor.readAnalog(this, iopin, callback);
}

UDOOBlu.prototype.subscribeAnalog = function (iopin, callback, subscribed) {
  this.gpioSensor.subscribeAnalog(this, iopin, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeAnalog = function (callback, subscribed) {
  this.gpioSensor.unsubscribeAnalog(this, callback, subscribed);
}

UDOOBlu.prototype.subscribeDigital = function (callback, subscribed) {
  this.gpioSensor.subscribeDigital(this, callback, subscribed);
}

UDOOBlu.prototype.subscribeDigitalPin = function (iopin, callback, subscribed) {
  this.gpioSensor.subscribePinDigital(this, iopin, callback, subscribed);
}

UDOOBlu.prototype.unsubscribeDigital = function (callback, subscribed) {
  this.gpioSensor.unsubscribeDigital(this, callback, subscribed);
};

UDOOBlu.prototype.writeDigital = function (gpios, callback) {
  this.gpioSensor.writeDigital(this, gpios, callback);
};

UDOOBlu.prototype.setPwm = function (freq, cycle, iopin, callback) {
  this.gpioSensor.setPwm(this, freq, cycle, iopin, callback);
};

UDOOBlu.prototype.setLed = function (led, state, callback) {
  this.ledSensor.setLed(this, led, state, callback);
};

module.exports = UDOOBlu;
module.exports.AccelerometerUUIDService = AccelerometerUUIDService;
module.exports.MagnetometerUUIDService = MagnetometerUUIDService;
module.exports.GyroscopeUUIDService = GyroscopeUUIDService;
module.exports.TemperatureUUIDService = TemperatureUUIDService;
module.exports.BarometerUUIDService = BarometerUUIDService;
module.exports.HumidityUUIDService = HumidityUUIDService;
module.exports.AmbientLightUUIDService = AmbientLightUUIDService;
module.exports.GPIOUUIDService = GPIOUUIDService;