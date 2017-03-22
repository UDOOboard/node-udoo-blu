var BluManager = require('./lib/udoo-blu-device');
var UDOOBluDevice = require('./lib/udoo-blu-device/blu');
var async = require('async');

var bluManager = new BluManager();

var blus = {};

var bluDiscoverCallback = function (blu_per) {
    console.log('dd ', blu_per.id);
    blus[blu_per.id] = blu_per;
}

bluManager.on('bluDiscover', bluDiscoverCallback);

// blu.on('bluConnectAndSetup', bluConnectAndSetupCallback);

setTimeout(function () {
    gpio(blus['247189cd0706']);
}, 12000);


bluManager.scan();


function pwm(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp ' + udoobludevice.id);
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        }, function (callback) {
            console.log('setPinMode');
            var gpios = [];
            console.log(udoobludevice.IOPIN.A5);
            var GPIOA0 = udoobludevice.GPIO;
            GPIOA0.iopin = udoobludevice.IOPIN.A5;
            GPIOA0.mode = udoobludevice.IOPINMODE.PWM;

            gpios[0] = GPIOA0;
            udoobludevice.setPinMode(gpios, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            var gpios = [];
            console.log(udoobludevice.IOPIN.A5);
            var GPIOA0 = udoobludevice.GPIO;
            GPIOA0.iopin = udoobludevice.IOPIN.A5;
            GPIOA0.mode = udoobludevice.IOPINMODE.PWM;

            gpios[0] = GPIOA0;
            console.log('pwm  set');

            udoobludevice.setPwm(50, 1, udoobludevice.IOPIN.A5, function (error) {
                if (error) {
                    console.log('error', error);
                } else {
                    console.log('pwm ok');
                    callback();
                }
            });
        },
        function (callback) {
            setTimeout(callback, 1000);
        }, function (callback) {
            var gpios = [];
            console.log(udoobludevice.IOPIN.A5);
            var GPIOA0 = udoobludevice.GPIO;
            GPIOA0.iopin = udoobludevice.IOPIN.A5;
            GPIOA0.mode = udoobludevice.IOPINMODE.PWM;

            gpios[0] = GPIOA0;
            console.log('pwm  set');

            udoobludevice.setPwm(50, 20, udoobludevice.IOPIN.A5, function (error) {
                if (error) {
                    console.log('error', error);
                } else {
                    console.log('pwm ok');
                    callback();
                }
            });
        }
    ]);
}

function gpioNotify(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        function (callback) {
            console.log('setPinMode');
            var gpios = [];

            var GPIOA0 = {};
            GPIOA0.iopin = udoobludevice.IOPIN.A0;
            GPIOA0.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOA1 = {};
            GPIOA1.iopin = udoobludevice.IOPIN.A1;
            GPIOA1.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOA2 = {};
            GPIOA2.iopin = udoobludevice.IOPIN.A2;
            GPIOA2.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOA3 = {};
            GPIOA3.iopin = udoobludevice.IOPIN.A3;
            GPIOA3.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOA4 = {};
            GPIOA4.iopin = udoobludevice.IOPIN.A4;
            GPIOA4.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOA5 = {};
            GPIOA5.iopin = udoobludevice.IOPIN.A5;
            GPIOA5.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOD6 = {};
            GPIOD6.iopin = udoobludevice.IOPIN.D6;
            GPIOD6.mode = udoobludevice.IOPINMODE.DGI;

            var GPIOD7 = {};
            GPIOD7.iopin = udoobludevice.IOPIN.D7;
            GPIOD7.mode = udoobludevice.IOPINMODE.DGI;

            gpios[0] = GPIOA0;
            gpios[1] = GPIOA1;
            gpios[2] = GPIOA2;
            gpios[3] = GPIOA3;
            gpios[4] = GPIOA4;
            gpios[5] = GPIOA5;
            gpios[6] = GPIOD6;
            gpios[7] = GPIOD7;

            udoobludevice.setPinMode(gpios, callback);
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            udoobludevice.readDigital(function (error, iopins) {
                console.log('read iopin ' + new Date().getTime());
                for (var key in iopins) {
                    console.log('iopin ' + iopins[key]);
                }
                callback();
            });
        },
        function (callback) {
            setTimeout(callback, 2000);
        },
        function (callback) {
            console.log('subscribe');

            var digitalSensorChange = function (iopins) {
                console.log('iopin ' + new Date().getTime());
                for (var key in iopins) {
                    console.log('iopin ' + iopins[key]);
                }
            };

            udoobludevice.subscribeDigital(function (error) {
                var obj = {};
                if (error) {
                    obj.err = "fail";
                    obj.sensor = 'digital';
                    console.log('erorr');
                } else { }
            }, digitalSensorChange);
        }
    ]);
}


function gpio(udoobludevice) {
    async.series([
        function (callback) {
            console.log('connectAndSetUp');
            udoobludevice.connectAndSetUp(callback);
        },
        // function (callback) {
        //     console.log('setPinMode');
        //     var gpios = [];
        //     console.log(udoobludevice.IOPIN.A1);
        //     var GPIOA0 = udoobludevice.GPIO;
        //     GPIOA0.iopin = udoobludevice.IOPIN.A0;
        //     GPIOA0.mode = udoobludevice.IOPINMODE.DGO;
        //     GPIOA0.value = udoobludevice.IOPINVALUE.HIGH;


        //     gpios[0] = GPIOA0;
        //     udoobludevice.setPinMode(gpios, callback);
        // },
        // function (callback) {
        //     setTimeout(callback, 2000);
        // },
        // function (callback) {
        //     var gpios = [];
        //     console.log(udoobludevice.IOPIN.A1);
        //     var GPIOA0 = udoobludevice.GPIO;
        //     GPIOA0.iopin = udoobludevice.IOPIN.A0;
        //     GPIOA0.mode = udoobludevice.IOPINMODE.DGO;
        //     GPIOA0.value = udoobludevice.IOPINVALUE.HIGH;
        //     gpios[0] = GPIOA0;
        //     udoobludevice.writeDigital(gpios, callback);
        // },
        // function (callback) {
        //     setTimeout(callback, 4000);
        // }, function (callback) {
        //     var gpios = [];
        //     console.log(udoobludevice.IOPIN.A1);
        //     var GPIOA0 = udoobludevice.GPIO;
        //     GPIOA0.iopin = udoobludevice.IOPIN.A0;
        //     GPIOA0.mode = udoobludevice.IOPINMODE.DGO;
        //     GPIOA0.value = udoobludevice.IOPINVALUE.LOW;
        //     gpios[0] = GPIOA0;
        //     udoobludevice.writeDigital(gpios, callback);
        // },


        function (callback) {
            var analSensorChange = function (value) {
                console.log('iopin ' + value);
            };
            console.log('notifyAnalog');
            udoobludevice.subscribeAnalog(udoobludevice.IOPIN.A0, function (error) {
                if (error) {
                    console.log('error subscribe');
                } else {
                    console.log('subscribe analogSensorChange');
                }
            }, analSensorChange);
        }
    ]);
}