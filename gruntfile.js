/*jshint camelcase: false*/
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'


module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        root: '.', // Necessary for chrome structure and for fast development
        app: 'app', // Output of compiled files
        src: 'src',
        public: 'public'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                spawn: false
            },
            basic: {
                files: ['<%= yeoman.src %>/**', '!*.coffee'],
                tasks: ['copy:dist']
            },
            coffee: {
                files: ['<%= yeoman.src %>/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            recess: {
                files: ['<%= yeoman.src %>/public/{,*/}*.less'],
                tasks: ['recess']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.src %>/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.src %>',
                        src: '{,*/}*.coffee',
                        dest: '<%= yeoman.app %>',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        recess: {
            options: {
                compile: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.public %>/stylesheets/',
                        src: '{,*/}*.less',
                        dest: '<%= yeoman.public %>/stylesheets/', // Necessary since no mounting is possible
                        ext: '.css'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.src %>',
                        dest: '<%= yeoman.app %>',
                        src: [
                            '**',
                            '!*.coffee'
                        ]
                    }
                ]
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedFolders: ['app'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 5000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            dist: [
                'bower',
                'coffee:dist',
                'recess',
            ],
            test: [
                'coffee:test'
            ],
            watch: [
                'nodemon',
                'watch'
            ],
            options: {
                logConcurrentOutput: true
            }
        },
        bower: {
            install: {
                targetDir: './public/lib'
            }
        }
    });

    grunt.registerTask('default', [
        'concurrent:dist',
        'copy:dist', // After Coffeescripts have been prepared
        'concurrent:watch'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'concurrent:test',
        'connect:test',
        'mocha'
    ]);

    // Necessary for Heroku to enable rebuilding app folder
    grunt.registerTask('build', [
        'concurrent:dist'
    ]);

};