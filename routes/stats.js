'use strict';

module.exports = function () {
    var express = require('express'),
        router = express.Router(),
        utils = require('../lib/utils'),
        LolClient = require('../api/lol');

    var lolClient = new LolClient();

    router.post('/', function (req, res) {
        res.redirect('stats/summoner/' + req.body.region + '/' + req.body.summonerName);
    });

    router.get('/summoner/:region/:summonerName', function (req, res) {
        // Ensure summoner exists
        lolClient.getSummonerIDFromName({
            region: req.params.region.toLowerCase(),
            summonerName: req.params.summonerName.toLowerCase()
        }, function (error, result) {
            if (error === null) {
                var summoner = result[req.params.summonerName];
                summoner.image = lolClient.getSummonerImageUrl(summoner.profileIconId);
                delete summoner.profileIconId;

                res.render('stats/summoner-champions', {
                    summoner: summoner
                });
            } else {
                res.render('error', {
                    error: error
                });
            }
        });
    });

    router.get('/', function (req, res) {
        res.render('stats', {
            regions: lolClient.regions,
            defaultRegion: req.cookies.region || 'euw'
        });
    });

    router.get('/summoner/:region/:summonerName/top-categories', function (req, res) {
        lolClient.getChampionMasteryFromName({
            region: req.params.region.toLowerCase(),
            summonerName: req.params.summonerName.toLowerCase()
        }, function (error, champions) {
            if (error === null) {
                lolClient.getChampionsInfos({
                    region: req.params.region.toLowerCase(),
                    locale: req.getLocale()
                }, function (error, result) {
                    if (error === null) {
                        Object.keys(champions).forEach(function (key) {
                            var championId = champions[key].championId;
                            champions[key].image = lolClient.getChampionImageUrl(result.data[championId].image.full);
                        });
                        res.render('stats/top-categories', {
                            champions: result.data,
                            categories: [{
                                title: 'goal',
                                data: utils.getTop({
                                    data: champions,
                                    filter: function (item) {
                                        return item.chestGranted === false;
                                    },
                                    sort: function (item) {
                                        return item.championPoints * -1;
                                    }
                                })
                            }, {
                                title: 'random',
                                data: utils.randomTop({
                                    data: champions,
                                    filter: function (item) {
                                        return item.chestGranted === false;
                                    }
                                })
                            }, {
                                title: 'less-played',
                                data: utils.getTop({
                                    data: champions,
                                    filter: function (item) {
                                        return item.chestGranted === false;
                                    },
                                    sort: function (item) {
                                        return item.championPoints;
                                    }
                                })
                            }]
                        });
                    } else {
                        res.render('error', {
                            error: error
                        });
                    }
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