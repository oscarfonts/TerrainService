'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var elevation = require('../elevation');
var demFile = path.join(__dirname, '../../data/DEM.tif');
var elevate = elevation(demFile);

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
router.post('/layer', function(req, res) {
    var fork = require('child_process').fork;
    var child = fork(path.join(__dirname, '../gdal_elevate'), [], {
        silent: true
    });

    req.pipe(child.stdin);
    child.stdout.pipe(res);
    child.sterr.pipe(process.stderr);

});

module.exports = router;
