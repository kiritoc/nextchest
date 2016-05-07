'use strict';

var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

var redisCache = cacheManager.caching({
    store: redisStore,
    host: process.env.OPENSHIFT_REDIS_HOST || 'localhost',
    port: process.env.OPENSHIFT_REDIS_PORT || 6379,
    auth_pass: process.env.REDIS_PASSWORD || null,
    db: 0,
    ttl: 600 // seconds
});

// listen for redis connection error event
redisCache.store.events.on('redisError', function (error) {
    // handle error here
    console.log(error);
});

module.exports = redisCache;