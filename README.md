# Overview
API layer of BLPM application.

# Quick Start

    # Install NPM modules, Bower packages, and any post-compilation
    npm install && bower install

    # Start server and watch folders for development
    grunt

# Architecture
Initially, this will be the API layer and backend layer. However, careful attention
should be made to keep these two layers coded modularly for a future inevitable separation.

## Folder Structure

    app - application itself should be here. Code JS files here directly, CoffeeScript will compile into here
    public - assets for static serving go here
    |-- lib - bower components are installed here
    src - CoffeeScript goes here; it'll compile into app folder
    test - add tests here
    | spec - BDD tests go here
    server.js - starting script of web application
    Procfile - used by Heroku to understand how to run application

# Tasks
* [X] Setup CoffeeScript
* [X] Setup Grunt
* [X] Add Nodemon
* [X] Setup Testing
* [X] Add MongoDB connection
* [X] Store in remote Git repository
* [X] Setup continuous delivery, that does integration, and finally packaging
* [X] Add MongoDB to CI server? If complicated, utilize a SaaS
    * [X] Utilize Cloudbee's MongoHQ
* [X] Extract Jenkins Configuration?
* [X] Simple Yeoman web-app application served with Node
* [X] Add a task model with MongoDB to start testing RESTful endpoint storage
    * [X] Add basic tests
* Setup continuous testing "watch"
* Add API versioning
* Add extremely basic authentication (hard-code passwords if necessary)
    * Incorporate any other feature of MEAN skeleton that you found useful
* Provide a basic connection between Chrome extension and this API
* Incorporate effective MEAN skeleton structure into application
* Add basic logging


## Lower Priority
* Node migrate but for Mongoose?

# Lessons Learnt
* CoffeeScript
    * It will complicate your folder structure. You need to figure out how to mix-and-match JS & CoffeeScript files
    * It will be complicated to debug (if at all) with an IDE
    * For tests, there is little benefit