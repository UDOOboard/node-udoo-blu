var noble = require('noble');
var util = require('util');
var events = require('events');
var udooBlu = require('./blu');

var blus = [];

var SensorsServiceUUID = 'd7728bf379c6452f994c9829da1a4229'; //Default UUID Adv

const SCAN_TIME = 10000;

var BluManager = function () { };

util.inherits(BluManager, events.EventEmitter);

BluManager.prototype.onBluDiscover = function (peripheral) {
  var bluOn = new udooBlu(peripheral);
  console.log('blu ', bluOn.id);
  this.emit('bluDiscover', bluOn);
};

BluManager.prototype.scan = function () {
  var that = this;
  var discoverCallback = function (peripheral) {
    that.onBluDiscover(peripheral);
  };

  var scan = function (state) {
    if (state === 'poweredOn') {
      console.log('startScanning');
      noble.startScanning(SensorsServiceUUID);
      setTimeout(function () {
        noble.stopScanning();
        console.log('stopScanning');
        noble.removeListener('discover', discoverCallback);
      }, SCAN_TIME);
    } else {
      noble.stopScanning();
      console.log('stopScanning');
    }
  };

  if (noble.state === 'poweredOn') {
    scan(noble.state);
  } else {
    noble.on('stateChange', scan);
  }
  noble.on('discover', discoverCallback);
};

BluManager.prototype.stop = function () {
  noble.stopScanning();
  console.log('stopScanning');
};

BluManager.prototype.getNoble = function(){
  return noble;
};

module.exports = BluManager;