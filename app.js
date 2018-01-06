var bleacon = require('bleacon');
var knex = require('knex')({
    dialect: 'sqlite3',
    debug: false,
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
knex.schema.hasTable('brew_sessions').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('brew_sessions', function (t) {
            t.increments('id').primary();
            t.string('brew_session_name');
            t.dateTime('created_date');
            t.string('uuid');
            t.integer('active');
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


bleacon.on('discover', function(bleacon){
    if ( !isTilt(bleacon) || !brewSessionExists(bleacon) ) {
        console.log("not a tilt or no session for color")
        return;
    } else {
        console.log("tilt recognized and session open")
    }

    elapsedTime = (new Date().getTime() - collection_date.getTime()) / 1000;
    if (elapsedTime > interval) {
        collection_date = new Date();
        console.log("Time    : " + collection_date);
        console.log("Tilt RED: " + bleacon.uuid);
        console.log("Temp    : " + bleacon.major + "f");
        console.log("SG      : " + (bleacon.minor/1000));

        // Write to database
        // knex('tilt_data').insert(
        //     {
        //         session_id: 1, 
        //         collection_date: collection_date, 
        //         sg: bleacon.minor, 
        //         temperature: bleacon.major,
        //         uuid: bleacon.uuid
        //     }
        // ).then(function(){
        //     console.log("data written");
        // });
    }
});

bleacon.startScanning();
console.log("Listening for Tilts");


// Functions
function isTilt (bleacon) {
    for (let i = 0; i < tilts.length; i++) {
        if (tilts[i].uuid === bleacon.uuid) {
            console.log("isTilt = true");
            return true;
        }
    }
    return false;
}

function brewSessionExists (bleacon) {
    knex('brew_sessions').where('uuid', bleacon.uuid).where('active', 1).first().then( data => {
        if (data) {
            console.log("brewSessionExists = true");
            return true;
        } else {
            return false;
        }
    });
}