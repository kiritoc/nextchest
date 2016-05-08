'use strict';

var _ = require('underscore'),
    defaultMaxTop = 6;

/**
 * Call list of callbacks
 *
 * @param callbacks
 * @param error
 * @param data
 */
function callMultipleCallbacks(callbacks, error, data) {
    callbacks.forEach(function (callback) {
        callback(error, data || []);
    });
}

/**
 * Filter data
 * Looks through each value in the data, returning an array of all the values that pass a truth test (filter).
 *
 * @param params - {data, filter}
 * @returns {data}
 */
function filterData(params) {
    if (typeof filter === 'function') {
        return _.filter(params.data, params.filter);
    }

    return params.data;
}

/**
 * Get the top list
 *
 * @param params - {data, filter, sort, max - optional}
 * @returns {*}
 */
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

/**
 * Get a random top list
 *
 * @param params - {data, filter, sort, max - optional}
 */
function randomTop(params) {
    params.data = filterData(params);

    return _.sample(params.data, params.max || defaultMaxTop);
}

module.exports = {
    callMultipleCallbacks: callMultipleCallbacks,
    getTop: getTop,
    randomTop: randomTop
};