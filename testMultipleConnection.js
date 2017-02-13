var UDOOBlu = require('./lib/udoo-blu-device/');

var async = require('async');
var blus = [];


console.log('--------START-------');

onDiscover = function (udoobludevice) {
    if (udoobludevice.id === '247189cd0384') {
        console.log('found ' + udoobludevice.id);
        led1(udoobludevice);
        UDOOBlu.stopDiscoverAll(onDiscover);
    }
    else if (udoobludevice.id === 'b0b448c3b181') {
        console.log('found ' + udoobludevice.id);
        led2(udoobludevice);
        UDOOBlu.stopDiscoverAll(onDiscover);
    }
}

UDOOBlu.discoverAll(onDiscover);


function connect(device) {
    if (device.id === '247189cd0384') {
        write2(device);
    } else if (device.id === 'b0b448c3b181') {
        write1(device);
    }
}


function connect2(device) {
    if (device.id === '247189cd0384') {
        led1(device);
    } else if (device.id === 'b0b448c3b181') {
        led2(device);
    }
}

function write1(device) {
    async.series([
        function (callback) {
            setTimeout(callback, 20000);
        },
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 1000);
        },
        function (callback) {
            var gpios = [];
            var GPIOA0 = device.GPIO;
            GPIOA0.iopin = device.IOPIN.A1;
            GPIOA0.mode = device.IOPINMODE.DGO;
            GPIOA0.value = device.IOPINVALUE.HIGH;
            console.log('setPinMode ' + device.id + ' pin ' + GPIOA0.iopin);
            gpios[0] = GPIOA0;
            device.setPinMode(gpios, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var gpios = [];
            console.log(device.id + " write pin " + device.IOPIN.A1);
            var GPIOA0 = device.GPIO;
            GPIOA0.iopin = device.IOPIN.A1;
            GPIOA0.mode = device.IOPINMODE.DGO;
            GPIOA0.value = device.IOPINVALUE.HIGH;
            gpios[0] = GPIOA0;
            device.writeDigital(gpios, callback);
        }]);
}

function write2(device) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 1000);
        },
        function (callback) {
            var gpios = [];
            var GPIOA0 = device.GPIO;
            GPIOA0.iopin = device.IOPIN.A0;
            GPIOA0.mode = device.IOPINMODE.DGO;
            GPIOA0.value = device.IOPINVALUE.HIGH;

            gpios[0] = GPIOA0;
            console.log('setPinMode ' + device.id + ' pin ' + GPIOA0.iopin);
            device.setPinMode(gpios, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var gpios = [];
            console.log(device.id + " write pin " + device.IOPIN.A0);
            var GPIOA0 = device.GPIO;
            GPIOA0.iopin = device.IOPIN.A0;
            GPIOA0.mode = device.IOPINMODE.DGO;
            GPIOA0.value = device.IOPINVALUE.HIGH;
            gpios[0] = GPIOA0;
            device.writeDigital(gpios, callback);
        }]);
}

function led1(device) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 3000);
        },
        function (callback) {
            console.log('set led yellow ' + device.id);
            device.setLed(device.LED.YELLOW, device.LEDSTATE.ON, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },

    ]);
}

function led2(device) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + device.id);
            device.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 3000);
        },
        function (callback) {
            console.log('set led red ' + device.id);
            device.setLed(device.LED.RED, device.LEDSTATE.ON, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },

    ]);
}