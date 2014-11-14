var gdal = require('gdal');

var input = gdal.open('/vsistdin/');
var iLayer = input.layers.get(0);

var output = input.driver.create('/vsistdout/');
var oLayer = output.layers.create(iLayer.name, null /*iLayer.srs*/ , iLayer.geomType);

var elevation = require('./elevation');

var dem = elevation('./data/DEM.tif');

iLayer.features.forEach(function(feature) {
    var geom = feature.getGeometry();

    if(geom.x) {
        var geom = dem.point(geom);
    }

    else if(geom.points) {
        points(geom.points);
    }

    else if(geom.rings) {
        var rc = geom.rings.count();
        var geom2 = new gdal.Polygon();
        for (var r = 0; r < rc; r++) {
            var ring = geom.rings.get(r);
            points(ring.points);
            geom2.rings.add(ring);
        }
        geom = geom2;
    }

    // TODO Parse GeometryCollection

    feature.setGeometry(geom);
    oLayer.features.add(feature);
});

function points(points) {
    var pc = points.count();
    for (var p = 0; p < pc; p++) {
        var point2d = points.get(p);
        var point3d = dem.point(point2d);
        points.set(p, point3d);
    }
}

input.close();
output.close();
