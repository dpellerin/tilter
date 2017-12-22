console.log("starting");

var Bleacon = require('bleacon');

var uuid = 'e2c56db5dffb48d2b060d0f5a71096e0';
var major = 0; // 0 - 65535
var minor = 0; // 0 - 65535
var measuredPower = -59; // -128 - 127 (measured RSSI at 1 meter)
var tiltred = 'a495bb10c5b14b44b5121370f02d74de'

// Bleacon.startAdvertising(uuid, major, minor, measuredPower);

Bleacon.on('discover', function(bleacon){
    console.log("Tilt RED: " + bleacon.uuid);
    console.log("Temp    : " + bleacon.major + "f");
    console.log("SG      : " + (bleacon.minor/1000)); 
});

Bleacon.startScanning(tiltred);
