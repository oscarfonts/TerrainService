
Terrain Service
===============

Incorporates height information (a Z coordinate) to geospatial vector data, reading it from a Digital Elevation Model raster file.

Based on node gdal bindings (see https://github.com/naturalatlas/node-gdal).

Includes both a node.js command-line utility called "gdal_elevate", and an express application that publishes the same functionality as a web service.


Installation
------------

Instructions for Ubuntu, your mileage may vary.

Install latest node.js:

    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install -y nodejs
    apt-get install nodejs

Clone this repo:

    git clone git@github.com:geomatico/TerrainService.git

Install its dependencies with npm:

    cd src
    npm install

If node-gdal doesn't work, build it from source:

    sudo apt-get install gdal-bin libgdal-dev
    npm install gdal --build-from-source --shared_gdal


Setup
-----

Add a GeoTIFF DEM file in EPSG:4326 to "data/DEM.tif". Yes, the file name *is* hardcoded at this time.
No reprojection is performed, so it is assumed that DEM will be in the same CRS than vector files.


Run from command line
---------------------

Run the "gdal_elevate" script. Reads 2D input data from "stdin", and outputs the 3D data to "stdout". For example, try the provided test files:

    gdal_elevate < data/test/simple.geojson
    gdal_elevate < data/test/barcelona.kml


Run as a web service
--------------------

Just run:

    web/server

And access it on port 3000. To get a point's height:

   http://localhost:3000/point/2.194048/41.424580

To process a whole file, send it by POST using the Content Type header "application/octet-stream". For example, using CURL:

    curl http://localhost:3000/layer -X POST --header "Content-Type:application/octet-stream" -d @../data/test/simple.geojson


Run the web server permanently
------------------------------

For Ubuntu systems, create an "upstart" script in "/etc/init/terrain-service.conf". Use the sample file at "doc/upstart_script_sample/terrain-service.conf".
Then run:

    sudo service terrain-service [start|stop|restart]



Online demo
-----------

A **pretty unstable** test server *may* be running at:

   http://northings.geomati.co:8080

For instance:

   http://northings.geomati.co:8080/point/2.194048/41.424580
   
Or try POSTing a file:

    curl http://northings.geomati.co:8080/layer -X POST --header "Content-Type:application/octet-stream" -d @../data/test/simple.geojson
