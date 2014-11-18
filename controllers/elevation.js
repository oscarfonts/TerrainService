'use strict';

var gdal = require('gdal');

var elevation = function(file) {
    var raster = gdal.open(file);
    var pixels = raster.bands.get(1).pixels;
    var size = raster.bands.get(1).size;
    var transform = raster.geoTransform;

    return {
        point: function(point) {
            // TODO Use simple x, y array, instead of gdal.point. Will reduce dependencies.
            var h = -9999;
            var col = Math.round((point.x - transform[0]) / transform[1]);
            var row = Math.round((point.y - transform[3]) / transform[5]);
            if (row >= 0 && col >= 0 && col < size.x && row < size.y) {
                h = pixels.get(col, row);
            } else {
                console.error("Coordinate " + point.x + ", " + point.y + " is out of DEM range. Assigned a default height of " + h);
            }
            return new gdal.Point(point.x, point.y, h);
        }
    };
};

module.exports = elevation;
