var Sensor = require('./sensor');
var Util = require('util');

var UUIDService = '0xA064';
var GPIOServiceUUID = 'd772a06479c6452f994c9829da1a4229';
var GPIOPinModeUUID = 'd772ace279c6452f994c9829da1a4229';
var GPIODigiatalDataUUID = 'd7726bcf79c6452f994c9829da1a4229';
var GPIOAnalogReadUUID = 'd772233a79c6452f994c9829da1a4229';
var GPIOAnalogPWMIndexUUID = 'd77200e279c6452f994c9829da1a4229';
var GPIOPWMConfigUUID = 'd772095579c6452f994c9829da1a4229';
var gpiosConfiguration = {};

var IOPIN = {
    A0: 0,
    A1: 2,
    A2: 4,
    A3: 6,
    A4: 8,
    A5: 10,
    D6: 12,
    D7: 14
}

var IOPINMODE = {
    DGO: 0,
    DGI: 1,
    ANR: 2,
    PWM: 3
}

var IOPINVALUE = {
    LOW: 0,
    HIGH: 1
}

var GPIO = {
    iopin: -1, //
    mode: -1, //
    value: -1 //
}

function GPIOSensor() {
    this.sensor = new Sensor();
    this.onAnalogChangeBinded = this.onAnalogChange.bind(this);
    this.onDigitalChangeBinded = this.onDigitalChange.bind(this);
    this.index = -1;
};

GPIOSensor.prototype.IOPIN = IOPIN;
GPIOSensor.prototype.IOPINMODE = IOPINMODE;
GPIOSensor.prototype.IOPINVALUE = IOPINVALUE;
GPIOSensor.prototype.GPIO = GPIO;

GPIOSensor.prototype.getUUIDService = function () {
    return UUIDService;
};

GPIOSensor.prototype.setPeriod = function (udooblu, period, callback) {
    this.sensor.writePeriodCharacteristic(udooblu, GPIOServiceUUID, period, callback);
};

GPIOSensor.prototype.enable = function (udooblu, callback) {
    this.sensor.enableConfigCharacteristic(udooblu, GPIOServiceUUID, callback);
};

GPIOSensor.prototype.disable = function (udooblu, callback) {
    this.sensor.disableConfigCharacteristic(udooblu, GPIOServiceUUID, callback);
};

GPIOSensor.prototype.readAnalog = function (udooblu, iopin, callback) {
    var that = this;
    var GPIO = udooblu.GPIO;
    GPIO.iopin = iopin;
    GPIO.mode = udooblu.IOPINMODE.ANR;
    if (this.__isResetPinMode([GPIO])) {
        this.setPinMode(udooblu, [GPIO], function () {
            setTimeout(function () {
                that.readAnalog(udooblu, iopin, callback);
            }, 1500);
        });
    } else {
        that.setAnalogPwmIndex(udooblu, iopin, function (error) {
            if (error) {
                return callback(error);
            }
            udooblu.readDataCharacteristic(GPIOServiceUUID, GPIOAnalogReadUUID, function (error, data) {
                if (error) {
                    return callback(error);
                }

                that.convertAnalogData(data, function (objectAnalog) {
                    callback(null, objectAnalog);
                }.bind(this));
            }.bind(this));
        });
    }
};

GPIOSensor.prototype.readDigital = function (udooblu, callback) {
    var that = this;
    udooblu.readDataCharacteristic(GPIOServiceUUID, GPIODigiatalDataUUID, function (error, data) {
        if (error) {
            return callback(error);
        }

        that.convertDigitalData(data, function (value) {
            callback(null, value);
        }.bind(this));
    }.bind(this));
};

GPIOSensor.prototype.readDigitalPin = function (udooblu, iopin, callback) {
    var that = this;
    var GPIO = udooblu.GPIO;
    GPIO.iopin = iopin;
    GPIO.mode = udooblu.IOPINMODE.DGI;
    if (this.__isResetPinMode([GPIO])) {
        this.setPinMode(udooblu, [GPIO], function () {
            setTimeout(function () {
                that.readDigital(udooblu, iopin, callback);
            }, 1500);
        });
    } else {
        this.readDigital(udooblu, callback)
    }
}

GPIOSensor.prototype.onAnalogChange = function (data) {
    var that = this;
    this.convertAnalogData(data, function (objectAnalog) {
        that.sensor.emit('analogSensorChange', objectAnalog);
    }.bind(this));
};

GPIOSensor.prototype.onDigitalChange = function (data) {
    var that = this;
    this.convertDigitalData(data, function (objectDigital) {
        that.sensor.emit('digitalSensorChange', objectDigital);
    }.bind(this));
};

GPIOSensor.prototype.convertDigitalData = function (data, callback) {
    var value = data.readUInt8(0);
    var iopins = {};
    Object.assign(iopins, IOPIN)
    var i = 0;
    for (var key in iopins) {
        iopins[key] = ((value >> i) & 1) == 1;
        i++;
    }
    callback(iopins);
};

GPIOSensor.prototype.convertAnalogData = function (data, callback) {
    var objectAnalog = data.readUInt16LE(0) & 0xFFF;
    callback(objectAnalog);
};

GPIOSensor.prototype.subscribeAnalog = function (udooblu, iopin, callback, subscribed) {
    var that = this;
    var GPIO = udooblu.GPIO;
    GPIO.iopin = iopin;
    GPIO.mode = udooblu.IOPINMODE.ANR;
    if (this.__isResetPinMode([GPIO])) {
        this.setPinMode(udooblu, [GPIO], function () {
            setTimeout(function () {
                that.subscribeAnalog(udooblu, iopin, callback, subscribed);
            }, 1500);
        });
    } else {
        this.sensor.on('analogSensorChange', subscribed);
        var bind = this.onAnalogChangeBinded;
        this.setAnalogPwmIndex(udooblu, iopin, function (error) {
            if (error) {
                return callback(error);
            }
            udooblu.subscribeCharacteristic(GPIOServiceUUID, GPIOAnalogReadUUID, bind, callback);
        });
    }
};

GPIOSensor.prototype.unsubscribeAnalog = function (udooblu, callback, subscribed) {
    this.sensor.removeListener('analogSensorChange', subscribed);
    udooblu.unsubscribeCharacteristic(GPIOServiceUUID, GPIOAnalogReadUUID, this.onAnalogChangeBinded, callback);
}

GPIOSensor.prototype.subscribeDigital = function (udooblu, iopin, callback, subscribed) {
    this.sensor.on('digitalSensorChange', subscribed);
    udooblu.subscribeCharacteristic(GPIOServiceUUID, GPIODigiatalDataUUID, this.onDigitalChangeBinded, callback);
};

GPIOSensor.prototype.subscribePinDigital = function (udooblu, iopin, callback, subscribed) {
    var that = this;
    var GPIO = udooblu.GPIO;
    GPIO.iopin = iopin;
    GPIO.mode = udooblu.IOPINMODE.DGI;
    if (this.__isResetPinMode([GPIO])) {
        this.setPinMode(udooblu, [GPIO], function () {
            setTimeout(function () {
                that.subscribeDigital(udooblu, callback, subscribed);
            }, 1500);
        });
    } else {
        this.sensor.on('digitalSensorChange', subscribed);
        udooblu.subscribeCharacteristic(GPIOServiceUUID, GPIODigiatalDataUUID, this.onDigitalChangeBinded, callback);
    }
};

GPIOSensor.prototype.unsubscribeDigital = function (udooblu, callback, subscribed) {
    this.sensor.removeListener('digitalSensorChange', subscribed);
    udooblu.unsubscribeCharacteristic(GPIOServiceUUID, GPIODigiatalDataUUID, this.onDigitalChangeBinded, callback);
}

GPIOSensor.prototype.setPinMode = function (udooblu, gpios, callback) {
    var value = 0
    for (var i = 0; i < gpios.length; i++) {
        var gpio = gpios[i];
        gpiosConfiguration[gpio.iopin] = gpio;
    }

    for (var key in gpiosConfiguration) {
        var gpio = gpiosConfiguration[key];
        value = (value | ((gpio.mode & 0xFFFF) << gpio.iopin));
    }
    console.log("value setPin " + value);
    udooblu.writeUInt16LECharacteristic(GPIOServiceUUID, GPIOPinModeUUID, value, callback);
};

GPIOSensor.prototype.__isResetPinMode = function (gpios) {
    for (var i = 0; i < gpios.length; i++) {
        var gpio = gpiosConfiguration[gpios[i].iopin];
        if (gpio === undefined || (gpio.mode != gpios[i].mode)) {
            return true;
        }
    }
    return false;
};

GPIOSensor.prototype.setAnalogPwmIndex = function (udooblu, iopin, callback) {
    var value = 0;
    size = iopin / 2;
    for (i = 0; i < size; i++) {
        value = i + 1;
    }
    this.index = iopin;
    udooblu.writeUInt8Characteristic(GPIOServiceUUID, GPIOAnalogPWMIndexUUID, value, callback);
}

GPIOSensor.prototype.writeDigital = function (udooblu, gpios, callback) {
    var that = this;
    if (this.__isResetPinMode(gpios)) {
        this.setPinMode(udooblu, gpios, function () {
            setTimeout(function () {
                that.writeDigital(udooblu, gpios, callback);
            }, 1500);
        });
    } else {
        var value = 0;
        for (var i = 0; i < gpios.length; i++) {
            gpio = gpios[i];
            value = (value | ((gpio.value & 0xFF) << (gpio.iopin / 2)));
        }
        udooblu.writeUInt8Characteristic(GPIOServiceUUID, GPIODigiatalDataUUID, value, callback);
    }
}

GPIOSensor.prototype.setPwm = function (udooblu, freq, dutyCycle, iopin, callback) {
    var that = this;
    var GPIO = udooblu.GPIO;
    GPIO.iopin = iopin;
    GPIO.mode = udooblu.IOPINMODE.PWM;
    if (this.__isResetPinMode([GPIO])) {
        this.setPinMode(udooblu, [GPIO], function () {
            setTimeout(function () {
                that.setPwm(udooblu, freq, dutyCycle, iopin, callback);
            }, 1500);
        });
    } else {
        this.setAnalogPwmIndex(udooblu, iopin, function (error) {
            if (error) {
                return callback(error);
            }
            var buffer = new Buffer(5);
            buffer.writeUInt32LE(freq, 0);
            buffer.writeUInt8(dutyCycle, 4);

            udooblu.writeDataCharacteristic(GPIOServiceUUID, GPIOPWMConfigUUID, buffer, callback);
        });
    }
}

module.exports = GPIOSensor;
module.exports.UUIDService = UUIDService;