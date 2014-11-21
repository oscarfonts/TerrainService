Terrain Service
===============

Incorporates height information (a Z coordinate) to geospatial vector data, reading it from a Digital Elevation Model raster file.

Can be run as a command-line utility, as a Node.js module, or as a web service.

No reprojection is performed, so it is assumed that DEM will be in the same CRS than vector files.

Uses node gdal bindings (see https://github.com/naturalatlas/node-gdal).


Installation
------------

Tested on Ubuntu 14.04.

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

Finally, edit the "web/config.js" file, to point to your DEM file.


Running from command line
-------------------------

Run the "gdal_elevate" script. Reads 2D input data (from a file or "stdin"), and outputs the 3D data (to a file or "stdout"). For example, try with the provided test files:

    ./gdal_elevate ../data/DEM.tif ../data/test/simple.geojson
    ./gdal_elevate ../data/DEM.tif ../data/test/barcelona.kml


For an usage message, run without parameters:

    ./gdal_elevate


Running as a web service
------------------------

Just run:

    web/server

And access it on port 8080. To get a point's height:

   http://localhost:8080/point/2.194048/41.424580

To process a whole file, send it by POST. For example, using CURL:

    curl http://localhost:8080/layer -X POST -d @../data/test/simple.geojson

To deploy the service permanently in a public [Ubuntu] server, create an "upstart" script called "/etc/init/terrain-service.conf" as root. Use the sample file at "doc/upstart_script_sample/terrain-service.conf", changing the paths as needed.

Then run:

    sudo service terrain-service [start|stop|restart]


Online demo
-----------

A test server is running at:

   http://northings.geomati.co:8080

For instance:

   http://northings.geomati.co:8080/point/2.194048/41.424580
   
Or try POSTing a file:

    curl http://northings.geomati.co:8080/layer -X POST -d @../data/test/simple.geojson


Credits
-------

Sample DEM data downloaded from:
http://www.ign.es/wcs/mdt?service=WCS&request=GetCapabilities
(c) Instituto Geográfico Nacional de España
