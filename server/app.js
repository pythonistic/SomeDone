#!/usr/bin/env node

/*
 var express = require('express')
  , Resource = require('express-resource')
  , app = express.createServer();

app.resource('forums', require('./forum'));
*/

var server = require('express').createServer();

// handlers

var account = require('./account.js');
var db = require('./db.js');

// route requests

server.get('/', function(req, res) {
    res.send('hello world');
});

server.get('/svc', function(req, res) {
    res.send('inside service');
});

server.get('/svc/blah', function(req, res) {
    res.send('get in service');
});

//server.post('/svc/login', account.login);
server.post('/svc/login', account.login);

db.somedone.get('foo', function(err, doc) {
    console.log('err', err);
    console.log('doc', doc);
});

server.listen(8101);