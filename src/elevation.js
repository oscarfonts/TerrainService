'use strict';

var gdal = require('gdal');

var elevation = function(file) {
    var raster = gdal.open(file);
    var transform = raster.geoTransform;
    var band = raster.bands.get(1);
    var pixels = band.pixels;
    var size = band.size;
    var nodata = band.noDataValue || NaN;

    var elevate = {
        z: function(x, y) {
            var h = NaN;
            var col = Math.round((x - transform[0]) / transform[1]);
            var row = Math.round((y - transform[3]) / transform[5]);
            if (row >= 0 && col >= 0 && col < size.x && row < size.y) {
                h = pixels.get(col, row);
            }
            return h == nodata ? NaN : h;
        },
        point: function(point) {
            return new gdal.Point(point.x, point.y, elevate.z(point.x, point.y));
        },
        linestring: function(linestring) {
            var points = linestring.points;
            var count = points.count();
            for (var i = 0; i < count; i++) {
                points.set(i, elevate.point(points.get(i)));
            }
            return linestring;
        },
        polygon: function(polygon) {
            var newPolygon = new gdal.Polygon();
            polygon.rings.forEach(function(ring) {
                newPolygon.rings.add(elevate.linestring(ring));
            });
            return newPolygon;
        },
        geometry: function(geometry) {
            // TODO support distinct MultiPolygon, MultiPoint and MultiLineString ?
            if (geometry.x) { // is a point
                return elevate.point(geometry);
            } else if (geometry.points) { // is a linestring
                return elevate.linestring(geometry);
            } else if (geometry.rings) { // is a polygon
                return elevate.polygon(geometry);
            } else if (geometry.children) { // is a collection
                return elevate.geometryCollection(geometry);
            }
        },
        geometryCollection: function(collection) {
            var newCollection = new gdal.GeometryCollection();
            collection.children.forEach(function(geometry) {
                newCollection.children.add(elevate.geometry(geometry));
            });
            return newCollection;
        },
        layer: function(inputFile, outputFile) {
            var inputDataset = gdal.open(inputFile || '/vsistdin/');
            var outputDataset = inputDataset.driver.create(outputFile || '/vsistdout/');

            var inputLayer = inputDataset.layers.get(0);
            var outputLayer = outputDataset.layers.create(inputLayer.name, inputLayer.srs, inputLayer.geomType);

            inputLayer.features.forEach(function(feature) {
                feature.setGeometry(elevate.geometry(feature.getGeometry()));
                outputLayer.features.add(feature);
            });

            inputDataset.close();
            outputDataset.close();
        }
    };

    return elevate;
};

module.exports = elevation;
