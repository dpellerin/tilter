var Bleacon = require('bleacon');
var checkpoint = new Date();
var interval = 5; // Seconds
var tiltred = 'a495bb10c5b14b44b5121370f02d74de'

// Bleacon.startAdvertising(uuid, major, minor, measuredPower);

Bleacon.on('discover', function(bleacon){
    elapsedTime = (new Date().getTime() - checkpoint.getTime()) / 1000;
    if (elapsedTime > interval) {
        checkpoint = new Date();
        console.log("Time    : " + checkpoint);
        console.log("Tilt RED: " + bleacon.uuid);
        console.log("Temp    : " + bleacon.major + "f");
        console.log("SG      : " + (bleacon.minor/1000)); 
    }
});

Bleacon.startScanning(tiltred);
console.log("Listening for Tilt Red");