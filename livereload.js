var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var path = require('path');
var livereload = require('livereload');

server = livereload.createServer();
server.watch(__dirname + "/parse/public");

app.set('view options', {
    layout: false
});

app.use(express.static(path.join(__dirname, 'parse/public')));

app.listen(9000);
