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

    sudo apt-get install curl
    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install nodejs
    node -v
    npm -v

Clone this repo:

    sudo apt-get install git
    git clone git@github.com:oscarfonts/TerrainService.git

Install its dependencies with npm:

    cd src
    npm install

Test it. If gdal fails to open your files, install gdal at system level, and build the bindings from source:

    sudo apt-get install gdal-bin libgdal-dev
    npm install gdal --build-from-source --shared_gdal

Finally, in case you want to run the web service, edit the "web/config.js" file to set to your DEM file location.


Running from command line
-------------------------

Run the "gdal_elevate" script. Reads 2D input data (from a file or "stdin"), and outputs the 3D data (to a file or "stdout"). For example, try with the provided test files:

    ./gdal_elevate.js data/DEM.tif test/data/simple.geojson
    ./gdal_elevate.js data/DEM.tif test/data/barcelona.kml


For an usage message, run without parameters:

    ./gdal_elevate.js


Using it as a Node.js module
----------------------------

Just require the module and init with a DEM file:

    var gdal_elevate = require('./gdal_elevate');
    var el = gdal_elevate('./data/DEM.tif');

The simplest method will return a height value given a coordinate pair:

    var height = el.z(2.194048, 41.424580);
    console.log(height);

In case the elevation is not found (point out of DEM domain), a NaN will be returned.

The most general method will return a 3D file from a 2D file:

    el.layer('test/data/simple.geojson' /* second param not set, outputs to stdout */);

In case input or output files are not set, the process will read from stdin and write to stdout, respectively.

To transform a particular gdal.Geometry:

    var gdal = require('gdal');

    var geom_2d = gdal.Geometry.fromWKT("POINT(2.194048 41.424580)");
    var geom_3d = el.geometry(geom_2d);
    console.log(geom_3d.toWKT());

A helper method is available to get the DEM extent as a gdal.Polygon:

    console.log(el.extent().toJSON());



Running as a web service
------------------------

Just run:

    web/server.js

And access it on port 8080. To get a point's height:

   http://localhost:8080/point/2.194048/41.424580

To process a whole file, send it by POST. For example, using CURL:

    curl http://localhost:8080/layer -X POST -d @test/data/simple.geojson

To get the DEM extent:

    http://localhost:8080/extent/


`Dockerfile` and `docker-compose.yaml` are available to run inside a container. 


Online demo
-----------

A test server is running at:

   http://demo.fonts.cat/TerrainService/

For instance:

   http://demo.fonts.cat/TerrainService/point/2.194048/41.424580
   
Or try POSTing a file:

    curl http://demo.fonts.cat/TerrainService/layer -X POST -d @test/data/simple.geojson


Credits
-------

Sample DEM data downloaded from:
http://www.ign.es/wcs/mdt?service=WCS&request=GetCapabilities
(c) Instituto Geográfico Nacional de España
