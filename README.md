
Terrain Service
===============

Incorporates height information (Z coordinate) to geospatial vector data, read from a Digital Elevation Model raster file.

Among others, it uses node-gdal library, see https://github.com/naturalatlas/node-gdal If it doens't work, build it from source:

    sudo apt-get install gdal-bin libgdal-dev
    npm install gdal --build-from-source --shared_gdal


Setting up
----------

Add a DEM file in GeoTIFF format and EPSG:4326 coordinate system (WGS84 lat, lon) in "data/DEM.tif".


Running from command line
-------------------------

Run the "controllers/layer.js" script. Reads 2D input data from "stdin" and outputs 3D tata to "stdout". For example, this simple GeoJSON file:

    $ node controllers/layer.js < data/test/simple.geojson

Or a KML file:

    $ node controllers/layer.js < data/test/barcelona.kml


Testing server on localhost
---------------------------

Just run:

    $ node bin/www

And access it on port 3000. To get a point's height:

    http://localhost:3000/point/2.194048/41.424580

To process a whole file, send it by POST using the Content Type header "application/octet-stream". For example, using CURL:

    $ curl -X POST -d @simple.geojson http://localhost:3000/layer --header "Content-Type:application/octet-stream"


Installing as a service
-----------------------

For Ubuntu systems, create an "upstart" script in "/etc/init/terrain-service.conf". Use the sample file at "upstart_script_sample/terrain-service.conf". Then run:

    $ sudo service terrain-service [start|stop|restart]



Online demo
-----------

A **pretty unstable** test server *may* be available at:

    http://northings.geomati.co:8080

For instance:

    http://northings.geomati.co:8080/point/2.194048/41.424580
