#!/usr/bin/env node
'use strict';

var debug = require('debug')('TerrainService');
var app = require('./app');
var config = require('./config');

app.set('port', process.env.PORT || config.serverPort || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
