'use strict';

var gdal = require('gdal');

var elevation = function(file) {
    var raster = gdal.open(file);
    var pixels = raster.bands.get(1).pixels;
    var transform = raster.geoTransform;

    return {
        point: function(point) {
            var col = Math.round((point.x - transform[0]) / transform[1]);
            var row = Math.round((point.y - transform[3]) / transform[5]);
            var h = pixels.get(col, row);
            return new gdal.Point(point.x, point.y, h);
        }
    };
};

module.exports = elevation;
