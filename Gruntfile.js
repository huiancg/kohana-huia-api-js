'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        concat: {
            dist: {
                files: {
                    'huia-api.js': 'src/**/*'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'huia-api.min.js': 'huia-api.js'
                }
            }
        }
		
    });
	
	// Build Front
	grunt.registerTask('build', [
		'concat:dist',
		'uglify:dist'
	]);
	
    grunt.registerTask('default', ['build']);
};