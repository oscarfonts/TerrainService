'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var elevation = require('../elevation');

var router = express.Router();
var elevate = elevation('../data/DEM.tif');

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
    console.log(x);
    console.log(y);
    console.log(elevate.z(x, y));
    res.send(elevate.z(x, y).toString());
});

/* Layer service */

// TODO use a raw bodyParser for *any* contentType, *and* propagate the content type header to the response.
router.use('/layer', bodyParser.raw({
    limit: '50mb'
}));
router.use('/layer', bodyParser.raw({
    type: 'application/json',
    limit: '50mb'
}));

router.post('/layer', function(req, res) {
    var fork = require('child_process').fork;
    var child = fork('./gdal_elevate', [], {
        silent: true
    });

    // TODO try to convert this to pipes
    child.stdin.end(req.body);

    child.stdout.on('data', function(data) {
        res.write(data);
    });

    child.stdout.on('end', function() {
        res.end();
    });

    child.stderr.on('data', function(data) {
        process.stderr.write(data);
    });

});

module.exports = router;
