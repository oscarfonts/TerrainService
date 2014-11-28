#!/usr/bin/env node
'use strict';

var gdal = require('gdal');

var elevation = function(file) {
    try {
        var raster = gdal.open(file);
    } catch(e) {
        throw Error("Error reading DEM file: " + file);
    }
    var transform = raster.geoTransform;
    var band = raster.bands.get(1);
    var pixels = band.pixels;
    var size = band.size;
    var nodata = band.noDataValue || NaN;

    // This is the interface that can be used when imported as a module
    var elevate = {
    	// Simplest use case, doesn't require gdal from the outside
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
            geometry.segmentize(transform[1]);
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
            try {
                var inputDataset = gdal.open(inputFile || '/vsistdin/');
            } catch (e) {
                var message = inputFile ? ("file: " + inputFile) : "data";
                throw new Error("Error parsing input " + message);
            }
            try {
                var outputDataset = inputDataset.driver.create(outputFile || '/vsistdout/');
            } catch (e) {
                var message = outputFile ? ("file: " + outputFile) : "data";
                throw new Error("Error creating output " + message);
            }   

            var inputLayer = inputDataset.layers.get(0);
            var outputLayer = outputDataset.layers.create(inputLayer.name, inputLayer.srs, inputLayer.geomType);

            inputLayer.features.forEach(function(feature) {
                feature.setGeometry(elevate.geometry(feature.getGeometry()));
                outputLayer.features.add(feature);
            });

            inputDataset.close();
            outputDataset.close();
        },
        extent: function() {
            function coords(col, row) {
                return ({
                    x: transform[0] + col * transform[1] + row * transform[2],
                    y: transform[3] + col * transform[4] + row * transform[5]
                });
            }
            var ring = new gdal.LinearRing();
            ring.points.add([
                coords(0, 0),
                coords(size.x, 0),
                coords(size.x, size.y),
                coords(0, size.y),
                coords(0, 0)
            ]);
            var polygon = new gdal.Polygon();
            polygon.rings.add(ring);
            return polygon;
        }
    };

    return elevate;
};

if (require.main === module) {
    if (process.argv.length < 3) {
    	// Show usage. At least the DEM file should be specified as parameter.
    	var command = require('path').basename(process.argv[1]);
    	console.log('\nAdd a 3rd dimension (Z coordinate) to vector data, read from a Digital Elevation Model. \
Similar to "gdallocationinfo" utility, but applied to an entire vector file. \
No reprojection is performed, so both DEM and vector file should be in the same CRS.');
        console.log('\nUsage: %s dem_file [src_file [dst_file]]\n', command);
        console.log('   dem_file: the raster DEM file to get Z coordinates from. Required.');
        console.log('   src_file: the input 2D vector file. Read from stdin if not specified.');
        console.log('   dst_file: the output 3D vector file. Written to stdout if not specified.\n');
    } else {
    	// Run script
        var dem = process.argv[2];
        var src = process.argv[3] || undefined;
        var dst = process.argv[4] || undefined;
        try {
            var elevate = elevation(dem);
            elevate.layer(src, dst);
        } catch(e) {
            console.error(e.message);
        }
    }
} else {
    // Use as a module
    module.exports = elevation;
}
