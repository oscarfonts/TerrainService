
Terrain Service
===============

Incorporates height information (Z coordinate) to geospatial vector data, read from a Digital Elevation Model raster file.

Install dependencies with npm:

    npm install

Among others, it uses node-gdal library, see https://github.com/naturalatlas/node-gdal
If gdal doesn't work, build it from source:

    sudo apt-get install gdal-bin libgdal-dev
    npm install gdal --build-from-source --shared_gdal


Setting up
----------

Add a GeoTIFF DEM file in EPSG:4326 to "data/DEM.tif". Yes, the file name *is* hardcoded.


Running from command line
-------------------------

**NOTE: At this stage, the commandline is broken.**

Run the "controllers/layer.js" script. Reads 2D input data from "stdin" and outputs the 3D data to "stdout". For example, try the provided simple GeoJSON test file:

    node controllers/layer.js < data/test/simple.geojson

Or a KML file:

    node controllers/layer.js < data/test/barcelona.kml


Starting a localhost server
---------------------------

Just run:

    node bin/www

And access it on port 3000. To get a point's height:

   http://localhost:3000/point/2.194048/41.424580

To process a whole file, send it by POST using the Content Type header "application/octet-stream". For example, using CURL:

    curl -X POST -d @simple.geojson http://localhost:3000/layer --header "Content-Type:application/octet-stream"


Installing as a service
-----------------------

For Ubuntu systems, create an "upstart" script in "/etc/init/terrain-service.conf". Use the sample file at "upstart_script_sample/terrain-service.conf". Then run:

    sudo service terrain-service [start|stop|restart]



Online demo
-----------

A **pretty unstable** test server *may* be available at:

   http://northings.geomati.co:8080

For instance:

   http://northings.geomati.co:8080/point/2.194048/41.424580
