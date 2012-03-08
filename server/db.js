#!/usr/bin/env node

var cradle = require('cradle');
var somedone_conn = new(cradle.Connection)('http://localhost', 5984, {
    cache: true,
    raw: false
});

// application data
var somedone_db = somedone_conn.database("somedone_alpha");
exports.somedone = somedone_db;

somedone_db.exists(function(err, exists) {
    if (err) {
        console.log('somedone db error', err);
    } else if (exists) {
        console.log('somedone database exists');
    } else {
        // create the database
        console.log('creating somedone database');
        somedone_db.create();
        // populate the designs
    }
});

// session data
var session_db = somedone_conn.database("session_alpha");
exports.session = session_db;

session_db.exists(function(err, exists) {
    if (err) {
        console.log('session db error', err);
    } else if (exists) {
        console.log('session database exists');
    } else {
        // create the database
        console.log('creating session database');
        session_db.create();
        // populate the designs
        session_db.save('_design/sessions', {
            get_active: {
                map: function(doc, user_id) {
                    var results = {}
                    if (doc.active_flag && doc.user_id === user_id) {
                        results["body"] = doc;
                    }
                    return results;
                }
            }
        });
    }
});

// account data
var account_db = somedone_conn.database("account_alpha");
exports.account = account_db;

account_db.exists(function(err, exists) {
    if (err) {
        console.log('account db error', err);
    } else if (exists) {
        console.log('account database exists');
    } else {
        // create the database
        console.log('creating account database');
        account_db.create();
        // populate the designs
    }
});

