'use strict';

module.exports = function () {
  var express = require('express'),
      router = express.Router(),
      stats = require('./stats'),
      contact = require('./contact');

  router.use('/stats', stats());
  router.use('/contact', contact());

  router.get('/*', function (req, res) {
    res.status(400);
    res.render('error', {
      message: "404",
      error: {}
    });
  });

  return router;
};