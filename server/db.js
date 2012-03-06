#!/usr/bin/env node

var cradle = require('cradle');
var somedone_conn = new(cradle.Connection)('http://localhost', 5984, {
    cache: true,
    raw: false
});
var somedone_db = somedone_conn.database("somedone_alpha");
exports.somedone = somedone_db;

somedone_db.exists(function(err, exists) {
    if (err) {
        console.log('error', err);
    } else if (exists) {
        console.log('database exists');
    } else {
        // create the database
        console.log('creating database');
        somedone_db.create();
        // populate the designs
    }
});
