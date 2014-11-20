'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

// Templates
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

// Logs
app.use(logger('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'static')));

// Routes
var routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler => no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
