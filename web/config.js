'use strict';

var path = require('path');

var config = {
    serverPort: 8080,
    demFile: path.join(__dirname, '../data/DEM.tif')
};

module.exports = config;
