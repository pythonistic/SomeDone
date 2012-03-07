#!/usr/bin/env node

var db = require('./db.js');

exports.login = function login(req, res) {
    var results = { };
    if (req && req.body) {
        var user_id = req.body.userId;
        var password_hash = req.body.passwordHash;
        var client_key = req.body.clientKey;
        
        if (user_id && password_hash && client_key) {
            results = do_login(user_id, password_hash, req.client.remoteAddress, client_key)
        } else {
            results["error"] = "unable to login - missing credentials";
        }
        
    } else {
        results["error"] = "unable to login - no body";
    }
    
    console.log("results", results);
    
    res.send(results);
};

var get_active_session = function get_active_session(user_id) {
    
};

var is_session_active = function is_session_active(session_id) {
    
};

var invalidate_session = function invalidate_session(session_id) {
    
};

var create_session = function create_session(user_id, client_host, client_key) {
    
};

var is_valid_password = function is_valid_password(user_id, password_hash) {
    var valid = false;
    
    return valid;
}

var do_login = function do_login(user_id, password_hash, client_host, client_key) {
    var results = {}
    var active_session_id = get_active_session(user_id);
    if (active_session_id) {
        // remove the active session
        invalidate_session(active_session_id);
    }
    
    // verify the password
    if (is_valid_password(user_id, password_hash)) {
        
    } else {
        results["error"] = "invalid credentials";
    }
    
    // create the new session
    console.log("user_id", user_id, "password_hash", password_hash, "client_host", client_host, "client_key", client_key);
    
    return results;
};

var load_session_keys = function load_session_keys(session_id) {
    
};

var create_user = function create_user(user_id, password_hash) {
    
};

var deactivate_user = function deactivate_user(user_id) {
    
}

console.log("account.js loaded");
