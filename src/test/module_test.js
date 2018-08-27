#!/usr/bin/env node
const gdal_elevate = require('../gdal_elevate');
const el = gdal_elevate('../../data/DEM.tif');

const height = el.z(2.194048, 41.424580);
console.log(height);
