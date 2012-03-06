#!/usr/bin/env node

console.log("account.js loaded");

exports.login = function login(req, res) {
    console.log("got request");
    console.log(req);
    res.send("Okay, you're where you want to be.");
}