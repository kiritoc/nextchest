'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        LolClient = require('../api/lol');

    var lolClient = new LolClient();

    router.post('/', function (req, res) {
        res.redirect('stats/summoner/' + req.body.region + '/' + req.body.summonerName);
    });

    router.get('/', function (req, res) {
        res.render('stats', {
            regions: lolClient.regions
        });
    });

    router.get('/summoner/:region/:summonerName', function (req, res) {
        lolClient.getChampionMasteryFromName({
            region: req.params.region.toLowerCase(),
            summonerName: req.params.summonerName.toLowerCase()
        }, function (error, data) {
            if (error === null) {
                res.render('stats/champions', {
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
                res.render('stats/champions', {
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