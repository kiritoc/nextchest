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
        }, function (error, champions) {
            if (error === null) {
                res.render('stats/champions');
            } else {
                res.render('error', {
                    error: error
                });
            }
        });
    });

    router.get('/', function (req, res) {
        res.render('stats', {
            regions: lolClient.regions
        });
    });

    router.get('/summoner/:region/:summonerName/top-categories', function (req, res) {
        lolClient.getChampionMasteryFromName({
            region: req.params.region.toLowerCase(),
            summonerName: req.params.summonerName.toLowerCase()
        }, function (error, champions) {
            if (error === null) {
                lolClient.getChampionsInfos({
                    region: 'euw',
                    locale: req.getLocale()
                }, function (error, result) {
                    if (error === null) {
                        Object.keys(champions).forEach(function (key) {
                            var championId = champions[key].championId;
                            champions[key].image = lolClient.getImageUrl(result.data[championId].image.full);
                        });

                        res.render('stats/top-categories', {
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

    router.get('/summoner/:region/:summonerName/topRandom', function (req, res) {
        res.render('', {
            title: 'random',
            data: utils.randomTop({
                data: champions,
                filter: function (item) {
                    return item.chestGranted === false;
                }
            })
        });
    });

    router.get('/summoner/:region/:summonerName/topLessPlayed', function (req, res) {
        res.render('', {
            title: 'less played',
            lessPlayed: utils.getTop({
                data: champions,
                filter: function (item) {
                    return item.chestGranted === false;
                },
                sort: function (item) {
                    return item.championPoints;
                }
            })
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