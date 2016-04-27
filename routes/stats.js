'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        LolClient = require('../lib/lol');

    router.get('/', function (req, res) {
        var lolClient = new LolClient();

        lolClient.getChampionMasteryFromName('euw', 'kiritoc', function (data) {
            res.render('stats', {
                data: JSON.stringify(data[0])
            });
        });
    });

    return router;
};