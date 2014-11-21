'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config');
var elevation = require('../gdal_elevate');
var elevate = elevation(config.demFile);

var router = express.Router();

/* Home page */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

/* Point service */
router.get('/point/:x/:y', function(req, res) {
    var x = parseFloat(req.params.x);
    var y = parseFloat(req.params.y);
    res.send(elevate.z(x, y).toString());
});

/* Layer service */
router.post('/layer', function(req, res, next) {
    var fork = require('child_process').fork;
    var child = fork(path.join(__dirname, '../gdal_elevate'), [config.demFile], {
        silent: true
    });

    req.pipe(child.stdin);
    child.stdout.pipe(res);

    var error_message = "";
    child.stderr.on('data', function(data) {
        child.stdout.unpipe(res);
        error_message += data.toString();
    });
    child.stderr.on('end', function() {
        next(new Error(error_message));
    });
});

module.exports = router;
