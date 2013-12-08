/*jshint camelcase: false*/
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/**/*.js'


module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        root: '.', // Necessary for chrome structure and for fast development
        app: 'app', // Output of compiled files
        src: 'src',
        public: 'public',
        test: 'test'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                spawn: false
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
                '<%= yeoman.app %>/**/*.js',
                'test/**/*.js'
            ]
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
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
                'recess',
            ],
            test: [
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
        'concurrent:watch'
    ]);

    // Useful for allowing IDE to debug main application
    grunt.registerTask('development', [
        'concurrent:dist',
        'watch'
    ]);

    grunt.registerTask('test', [
        'env:test',
        'concurrent:test',
        'mochaTest',
        'jshint'
    ]);

    // Necessary for Heroku to enable rebuilding app folder
    grunt.registerTask('build', [
        'concurrent:dist'
    ]);

};