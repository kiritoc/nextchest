'use strict';

var _ = require('underscore'),
    defaultMaxTop = 6;

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
    getTop: getTop,
    randomTop: randomTop
};