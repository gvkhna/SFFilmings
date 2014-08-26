'use strict';

// configurable paths for node app
var ROOT = 'parse';
var APP = ROOT + '/public';
var PORT = 9000;


var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// define grunt task options
module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var appConfig = {
        app: 'parse/public',
        root: 'parse',
        dist: 'dist',
        port: 9000
    };

    grunt.initConfig({
        appConfig: appConfig,
        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        shell: {
            debugtest: {
                options: {
                    stdout: true
                },
                command: 'node --debug-brk $(which grunt) test'
            },
            debugtestdev: {
                options: {
                    stdout: true
                },
                command: 'NODE_ENV=dev node --debug-brk $(which grunt) test'
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: '9000'
                    },
                    // omit this property if you aren't serving HTML files and 
                    // don't want to open a browser tab on start
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                //require('open')('http://localhost:9000');
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        watch: {
            server: {
                files: ['.rebooted', '**/*.js'],
                options: {
                    livereload: true
                },
                tasks: ['jasmine']
            }
        },
        jasmine: {
            src: "parse/public/js/main.js",
            options: {
                vendor: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
                ],
                specs: "specs/client/spec.js"
            }
        },
        open: {
            dev: {
                path: 'http://localhost:' + PORT
            }
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 8888,
                    'web-host': 'localhost',
                    'debug-port': 5857,
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 100,
                    'hidden': ['node_modules']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= appConfig.root %>/{,*/}*.js',
                '!<%= appConfig.root %>/public/js/vendor/*',
                'spec/{,*/}*.js'
            ]
        },
        exec: {
            deploy: {
                command: 'cd parse;parse deploy'
            }
        },
        jsbeautifier: {
            files: ['parse/**/*.js', '*.js', 'parse/**/*.html', 'parse/**/*.css', '!parse/public/js/vendor/*.js'],
            options: {
                html: {
                    fileTypes: ['.html'],
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0
                },
                css: {
                    fileTypes: '.css',
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    fileTypes: ['.js'],
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        jst: {
            compile: {
                options: {
                    prettify: true
                },
                files: {
                    '<%= appConfig.root %>/public/jst.js': ['templates/**/*.jst']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['parse/public/js/*.js'],
                dest: 'docs/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-jsdoc-plugin');


    grunt.registerTask('test', [
        'build'
    ]);

    grunt.registerTask('build', [
        'jsbeautifier',
        'jst'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'exec:deploy'
    ]);
};
