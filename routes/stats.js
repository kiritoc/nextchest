'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        LolClient = require('../api/lol');

    var lolClient = new LolClient();

    router.get('/summoner/:summonerName', function (req, res) {
        lolClient.getChampionMasteryFromName({
            region: 'euw',
            summonerName: req.params.summonerName
        }, function (error, data) {
            if (error === null) {
                res.render('stats', {
                    data: data
                });
            } else {
                res.render('error', {
                    error: error
                });
            }
        });
    });

    router.get('/champions', function (req, res) {
        lolClient.getChampionsInfos({
            region: 'euw',
            locale: req.getLocale()
        }, function (error, result) {
            if (error === null) {
                res.render('stats', {
                    data: result.data
                });
            } else {
                res.render('error', {
                    error: error
                });
            }
        });
    });

    return router;
};