'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        stats = require('./stats'),
        contact = require('./contact');

    router.use('/', stats());
    router.use('/stats', stats());
    router.use('/contact', contact());

    router.get('/*', function (req, res) {
        res.status(400);
        res.render('error', {
            error: {
                status_code: "404",
                message: "page not found"
            }
        });
    });

    return router;
};