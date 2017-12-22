var Bleacon = require('bleacon');
var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
      filename: './db/tilter.sqlt'
    },
    useNullAsDefault: true
});
var collection_date = new Date();
var interval = 5; // Seconds
var tilts = [
    { uuid: 'a495bb10c5b14b44b5121370f02d74de', color: 'red' },
    { uuid: 'a495bb20c5b14b44b5121370f02d74de', color: 'green' },
    { uuid: 'a495bb30c5b14b44b5121370f02d74de', color: 'black' },
    { uuid: 'a495bb40c5b14b44b5121370f02d74de', color: 'purple' },
    { uuid: 'a495bb50c5b14b44b5121370f02d74de', color: 'orange' },
    { uuid: 'a495bb60c5b14b44b5121370f02d74de', color: 'blue' },
    { uuid: 'a495bb70c5b14b44b5121370f02d74de', color: 'yellow' },
    { uuid: 'a495bb80c5b14b44b5121370f02d74de', color: 'pink' }
];

// Verify and Create Schema
knex.schema.hasTable('sessions').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('sessions', function (t) {
            t.increments('id').primary();
            t.string('session_name');
            t.dateTime('start_date');
            t.dateTime('end_date');
            t.string('uuid');
        });
    }
});
knex.schema.hasTable('tilt_data').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('tilt_data', function (t) {
            t.increments('id').primary();
            t.integer('session_id');
            t.dateTime('collection_date');
            t.integer('temperature');
            t.integer('sg');
            t.string('uuid');
        });
    }
});


Bleacon.on('discover', function(bleacon){
    if (!isTilt()) {
        return;
    }

    elapsedTime = (new Date().getTime() - collection_date.getTime()) / 1000;
    if (elapsedTime > interval) {
        collection_date = new Date();
        console.log("Time    : " + collection_date);
        console.log("Tilt RED: " + bleacon.uuid);
        console.log("Temp    : " + bleacon.major + "f");
        console.log("SG      : " + (bleacon.minor/1000));

        // Write to database
        knex('tilt_data').insert(
            {
                session_id: 1, 
                collection_date: collection_date, 
                sg: bleacon.minor, 
                temperature: bleacon.major,
                uuid: bleacon.uuid
            }
        ).then(function(){
            console.log("data written");
        });
    }
});

Bleacon.startScanning();
console.log("Listening for Tilts");


// Functions
function isTilt () {
    for (let i = 0; i < tilts.length; i++) {
        if (tilts[i].uuid === bleacon.uuid) {
            console.log(tilts[i].color);
            return true;
        }
    }
    return false;
}