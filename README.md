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
* [X] Add API versioning
* [X] Setup continuous testing "watch"
* [X] Setup basic WebSocket communication as well
    * [X] Essentially, RESTful and WebSocket connection for flexible API
* [X] Investigate "TODOs" in the code and resolve them
* [X] Confirm WebSocket with Heroku use, otherwise switch to long-polling
* [X] Improve semantic naming of "messages" and "listeners" - Not intuitive
* [X] Add "services" folder
    * [X] Services should emit the internal events
    * [X] Services should be promises, or at least something that takes "success" or "fail" callbacks
        * [X] Callbacks will be used by API calls while maybe by socket calls
* [X] Add application monitoring
* [X] Add extremely basic authentication (hard-code passwords if necessary)
* [X] Add Socket.IO authentication as well
    * [X] Concept: after a session is setup and stored in cookie, Socket.IO simply needs
    to verify the session ID to be real. That's all tha is required. As such, we will
    need to bring back sessions and local strategy to achieve this.
    * [X] https://github.com/LearnBoost/socket.io/wiki/Authorizing
    * [X] Refer to passportjs-socket.io
* [X] Begin creating simple UI
* [X] Resolve "TODOs"
    * [X] Isolate keys into configs
* [X] Associate tasks to users
* [X] Have socket event emitted to appropriate users, not all users
    * [X] e.g. create a task, should not be sent to all users
* [X] Add this.timeout back
* [X] Update fields of Task to match those of Google Tasks
* Tests fail on first run (causing problems with Jenkins build)
    * http://mongoosejs.com/docs/guide.html#indexes
* Various taskServiceSpec.js simply not doing what is intended!
* Clean "exports.emitToCollaborators"
* Security concern regarding every part of user detail coming back (e.g. security token)
* Prevent unauthorized task activities
* Add real logging
* Add more tests
    * [X] Have grunt test:watch work on subsequent tests
    * Add test fixtures
    * Clean database completely (includes removing all session objects)
    * For services; confirm service errors being thrown are correct
    * Add socket API tests
    * Add authentication tests
* Last resort exception handler
* Add REDIS for scalability
* Update README to capture architecture (and ideas so they are not lost)
    * Do not forget to capture how Q is used, including 'done()'
* Provide a basic connection between Chrome extension and this API
* Incorporate effective MEAN skeleton structure into application
* Figure out how to scale websocket connections


## Tasks - Lower Priority
* Add filters for Socket API to white-list attributes
* Add psuedo-delete (have delete become true vs. removing document)
    * Then have a CRON job that removes old ones
* Change all references of "delete" to "del" (a JavaScript warning)
* Confirm security of using CORS for API
    * Allowing any origin a good idea?
* Full OAuth2 implementation with tokens being expired and renewed
* Add other authorization strategies
* Improve token authentication to expire and not last forever
* Add basic logging, and setup a plan on how to use them
* Understand how to create effective API
* Node migrate but for Mongoose?
* Last resort error handler
* API compression / optimization
* Add logging strategy
    * Incorporate any other feature of MEAN skeleton that you found useful
* Add analytics gathering strategy
* Add continuous testing on individual file change:
    * http://stackoverflow.com/questions/12063266/how-do-you-watch-multiple-files-but-only-run-task-on-changed-file-in-grunt-js

## Task Optimizations
* Services should have an option to request lean objects vs. full Mongoose objects

## Tasks - Infrastructure
In the future, if you wish to leave PaaS and go towards IaaS, the following may need to be done:

* Scale Socket.IO
    * https://github.com/markap/socket.io-scale

# Lessons Learnt
* CoffeeScript
    * It will complicate your folder structure. You need to figure out how to mix-and-match JS & CoffeeScript files
    * It will be complicated to debug (if at all) with an IDE
    * For tests, there is little benefit
* APIs do not need session support due to stateless calls
* Socket.IOs do need session support since connection persists