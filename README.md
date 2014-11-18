Uses a DEM file to incorporate height information to geospatial vector data.

It uses node-gdal, see https://github.com/naturalatlas/node-gdal

If gdal module is not working, install gdal-bin in your system, and build node-gdal bindings from source:

   sudo apt-get install gdal-bin
   npm install gdal --build-from-source --shared_gdal

