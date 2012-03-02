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

// route requests

server.get('/', function(req, res) {
    res.send('hello world');
});

server.get('/svc', function(req, res) {
    res.send('inside service');
});

server.post('/svc/login', account.login);

server.listen(8101);