'use strict';

var cacheManager = require('cache-manager'),
    redisStore = require('cache-manager-redis');

var redisCache = cacheManager.caching({
    store: redisStore,
    host: process.env.OPENSHIFT_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    port: process.env.OPENSHIFT_REDIS_PORT || process.env.REDIS_PORT || 6379,
    auth_pass: process.env.REDIS_PASSWORD || process.env.REDIS_PASSWORD ||  null,
    db: 0,
    ttl: 600 // 10 minutes
});

// listen for redis connection error event
redisCache.store.events.on('redisError', function (error) {
    // handle error here
    console.log(error);
});

module.exports = redisCache;