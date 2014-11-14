var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var elevation = require('../controllers/elevation');
var el = elevation('./data/DEM.tif');
var gdal = require('gdal');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/point/:x/:y', function (req, res) {
  var x = parseFloat(req.params.x);
  var y = parseFloat(req.params.y);
  var point = el.point(new gdal.Point(x, y));
  res.send(point.toJSON());
});

router.use('/layer', bodyParser.raw({limit: '50mb'}));
router.use('/layer', bodyParser.raw({type: "application/json", limit: '50mb'}));

router.post('/layer', function (req, res) {
  var fork = require('child_process').fork;
  var child = fork('controllers/layer', [], { silent: true });

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
