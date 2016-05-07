'use strict';

var _ = require('underscore'),
    defaultMaxTop = 6;

function callMultipleCallbacks(callbacks, error, data) {
    callbacks.forEach(function (callback) {
        callback(error, data || []);
    });
}

function filterData(params) {
    if (typeof filter === 'function') {
        return _.filter(params.data, params.filter);
    }

    return params.data;
}

function getTop(params) {
    if (typeof params.sort !== 'function') {
        return [];
    }

    params.data = filterData(params);

    return _.chain(params.data)
        .sortBy(params.sort)
        .first(params.max || defaultMaxTop)
        .value();
}

function randomTop(params) {
    params.data = filterData(params);

    return _.sample(params.data, params.max || defaultMaxTop);
}

module.exports = {
    callMultipleCallbacks: callMultipleCallbacks,
    getTop: getTop,
    randomTop: randomTop
};