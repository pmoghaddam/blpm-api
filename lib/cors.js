'use strict';

/**
 * Source: http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
 */

module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
};