'use strict';

module.exports = {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/blpm-test',
    dbOptions: { server: { socketOptions: { connectTimeoutMS: 5000 }}},
    port: 5001,
    app: {
        name: 'BLPM - Test'
    },
    io: {
        'log level': 1
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