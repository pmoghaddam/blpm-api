'use strict';

var port = 5001;

module.exports = {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/blpm-test',
    dbOptions: { server: { socketOptions: { connectTimeoutMS: 5000 }}},
    url: 'http://localhost:' + port,
    port: port,
    app: {
        name: 'BLPM - Test'
    },
    io: {
        'log level': 1
    },
    // Used for testing connections to server
    ioClient: {
        transports: ['websocket'],
        'force new connection': true,
        query: null // Set dynamically
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
};