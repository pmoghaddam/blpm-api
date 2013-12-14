'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    env: process.env.NODE_ENV || 'development',
    root: rootPath,
    rootPath: rootPath,
    viewPath: path.join(rootPath, 'app', 'views'),
    appPath: path.join(rootPath, 'app'),
    port: process.env.PORT || 5000,
    db: process.env.MONGOHQ_URL,
    dbOptions: {}
};
