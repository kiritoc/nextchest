'use strict';

module.exports = function() {
  var express = require('express'),
      router = express.Router();

  router.get('/', function(req, res) {
    res.render('contact');
  });

  return router;
};