A real-time task management tool with a backend Node.js + Mongoose, and [front-end Backbone.js/Marionette.js client](https://github.com/pmoghaddam/blmp-webapp), using Socket.IO and REST for real-time collaboration.

**Notes:** Made during Christmas break of 2013 as a quick prototype of mixing together Socket.IO, Mongoose, and Node.js with authentication.

[![Screenshot](https://dl.dropboxusercontent.com/u/17908170/BLPM-Screenshot-Smaller.png)](http://www.youtube.com/watch?v=Uj0qdmFMxfw)

# Overview
This repository holds the backend implementation of the application (BLPM). At it's core, it is a Node.js + Express.js application. There are however key additions:
 
* **Real-time** - Socket.IO is used to provide real-time capabilities. Additionally, Socket.IO is authenticated.
* **Authenticated WebSocket Connection** - Socket.IO is integrated into Passport.JS to allow authenticated websocket connections for sharing data.
* **RESTful & Real-time** - `app\config\routes` has routes for RESTful end-points, Websocket events, and static routes, with them directing to Controllers. Thus, while modern clients can utilize Websockets, traditional RESTful clients can continue to consume data as well.
* **Architected for Scale** - `app\config\env` holds onto multiple environments, helping develompent and testing. `lib\rekuire` allows you to require files without providing full path. `controllers` and `services` allow the application to cleanly grow as more logic is added.
* **Well-Tested** - The codebase is has traditional model and interation tests; but it also has unit tests for websocket events.

# Quick Start

    # Install NPM modules, Bower packages, and any post-compilation
    npm install && bower install

    # Start server and watch folders for development
    grunt