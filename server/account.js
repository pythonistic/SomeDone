#!/usr/bin/env node

var db = require('./db.js');
var sys = require('sys');

var login_done_invalidate = false;
var login_done_session = false;
var login_credentials = {};
var error_flag = false;
var response = undefined;
var results = {};

exports.login = function login(req, res) {
    response = res;
    var results = { };
    if (req && req.body) {
        var user_id = req.body.userId;
        var password_hash = req.body.passwordHash;
        var client_key = req.body.clientKey;
        
        if (user_id && password_hash && client_key) {
            // remove the active session
            get_active_session(user_id, invalidate_session);
    
            // log the user in
            login_credentials["user_id"] = user_id;
            login_credentials["password_hash"] = password_hash;
            login_credentials["remote_address"] = req.client.remoteAddress;
            login_credentials["client_key"] = client_key;
            do_login();
        } else {
            results["error"] = "unable to login - missing credentials";
        }
        
    } else {
        results["error"] = "unable to login - no body";
    }
    
    console.log("results", results);
};

var mark_login_done_invalidate = function mark_login_done_invalidate() {
    console.log("mark_login_done_invalidate");
    login_done_invalidate = true;
    send_login_results();
}

var mark_login_done_session = function mark_login_done_session(session) {
    console.log("mark_login_done_session", session);
    login_done_session = session;
    send_login_results();
}

var send_login_results = function send_login_results() {
    if (!results["error"]) {
        // send success results
        console.log("login_done_session", login_done_session);
        if (login_done_invalidate && login_done_session) {
            // return the session information
            results["sessionId"] = login_done_session.session_id;
            results["sessionKey"] = login_done_session.session_key;
        } else {
            // don't send anything yet!
            return;
        }
    }
    
    response.send(results);
}

var get_active_session = function get_active_session(user_id, callback) {
    // active session view by user id
    db.session.view('sessions/get_active', {"key": user_id, "descending": true},
        function(err, result) {
            if (result && result.length > 0) {
                callback(result[0]);
            } else {
                sys.puts("nope, no session");
            }
        });
};

var is_session_active = function is_session_active(session_id) {
    
};

var invalidate_session = function invalidate_session(session_id) {
    db.session.merge(session_id, { "active_flag": false }, function(err, res) {
        // do nothing
    });
    mark_login_done_invalidate();
};

var create_session = function create_session() {
    // generate the session ID
    var date = new Date();
    var session_seed = date.toUTCString() + parseInt(Math.random() * 1000);
    var session_id = passwordHash(session_seed);
    
    // create the session key
    var session_key = passwordHash(login_credentials.user_id + ":" + login_credentials.password_hash + ":" + login_credentials.client_key + ":" + session_id);

    // store the session
    db.session.put(session_id, {
        "session_id": session_id,
        "session_key": session_key,
        "user_id": login_credentials.user_id,
        "client_host": login_credentials.client_host,
        "client_key": login_credentials.client_key,
        "create_date": date.toUTCString(),
        "active_flag": true
    });
    
    return {
        "session_id": session_id,
        "session_key": session_key
    };
};

var is_valid_password = function is_valid_password() {
    var valid = false;
    
    // login_credentials.user_id
    // login_credentials.password
    
    valid = true;
    
    return valid;
}

var do_login = function do_login() {
    console.log("user_id", login_credentials.user_id, "password_hash", login_credentials.password_hash, "client_host", login_credentials.client_host, "client_key", login_credentials.client_key);
    var my_session = undefined;

    // verify the password
    if (is_valid_password()) {
        // create the new session
        my_session = create_session();
    } else {
        results["error"] = "invalid credentials";
    }
    
    mark_login_done_session(my_session);
};

var load_session_keys = function load_session_keys(session_id) {
    
};

var create_user = function create_user(user_id, password_hash) {
    
};

var deactivate_user = function deactivate_user(user_id) {
    
};

var ARBITRARY_HASH_KEY = [
  0xb8f1, 0x18d9, 0xad80, 0xd9a9, 0xe901, 0x257b, 0x5e07, 0x1a31,
  0x70b7, 0x01fd, 0x6080, 0x1cf0, 0x0a15, 0xe16a, 0xa731, 0x8a80,
  0x73ba, 0x1bf0, 0x24e2, 0x7406, 0x660c, 0x1dcd, 0xdba5, 0xc05c,
  0x40c9, 0xcbb4, 0xeb68, 0xc294, 0x3a4b, 0xbf43, 0x904d, 0xffbf,
  0x27a3, 0xfac0, 0x11fe, 0x3e56, 0xb82b, 0x0007, 0xdfe7, 0xe3c0,
  0x183a, 0x46df, 0x515a, 0x46e5, 0xde80, 0x2e11, 0xe95d, 0xf870];

var HASH_OUT = [
  0x2c88, 0xc801, 0x14c0, 0x5886, 0x214f, 0x3b8e];

var passwordHash = function passwordHash(source) {
    console.log("source", source);
    var hashOut = "";
    var lastHash = 1;
    var hashIdx = source.length;
    var hashOut = HASH_OUT.slice(0);
    var sHashOut = "";
  
    for (var i = 0; i < source.length; i++) {
        var hashKey = ARBITRARY_HASH_KEY[hashIdx % ARBITRARY_HASH_KEY.length];
        lastHash = hashKey ^ (source[i].charCodeAt() + lastHash);
        hashOut[i % hashOut.length] = lastHash ^ hashOut[i % hashOut.length];
        hashIdx++;
    }

    // format against the output mask
    for (var i = 0; i < hashOut.length; i++) {
        var num = hashOut[i];
    
        sHashOut += (Math.abs(hashOut[i])).toString(16);
    }
  
    return sHashOut;
}

console.log("account.js loaded");
