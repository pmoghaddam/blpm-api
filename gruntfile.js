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

    // Setup necessary directoryes
    grunt.file.mkdir('./target');

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                spawn: false
            },
            recess: {
                files: ['<%= yeoman.src %>/public/{,*/}*.less'],
                tasks: ['recess']
            },
            test: {
                files: ['<%= yeoman.app %>/**/*.js', '<%= yeoman.test %>/**/*.js'],
                tasks: ['test']
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
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    // use the quiet flag to suppress the mocha console output
                    quiet: true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    captureFile: './target/coverage.html'
                },
                src: ['test/**/*.js']
            }
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
                'recess',
            ],
            watch: [
                'nodemon',
                'watch'
            ],
            options: {
                logConcurrentOutput: true
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
        'mochaTest:test',
//        'mochaTest:coverage',
        'jshint'
    ]);

    grunt.registerTask('test:watch', [
        'test',
        'watch:test'
    ]);

    // Necessary for Heroku to enable rebuilding app folder
    grunt.registerTask('build', [
        'concurrent:dist'
    ]);

};