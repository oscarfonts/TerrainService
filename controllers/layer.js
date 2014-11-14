var gdal = require('gdal');

var input = gdal.open('/vsistdin/');
var iLayer = input.layers.get(0);

var output = input.driver.create('/vsistdout/');
var oLayer = output.layers.create(iLayer.name, null /*iLayer.srs*/ , iLayer.geomType);

var elevation = require('./elevation');

var dem = elevation('./data/DEM.tif');

iLayer.features.forEach(function(feature) {
    var geom = feature.getGeometry();
    var pc = geom.points.count();

    for (var p = 0; p < pc; p++) {
        var point2d = geom.points.get(p);
        var point3d = dem.point(point2d);
        geom.points.set(p, point3d);
    }
    feature.setGeometry(geom);
    oLayer.features.add(feature);
});

input.close();
output.close();
