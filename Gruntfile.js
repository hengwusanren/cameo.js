/**
 * Created by v-kshe on 6/18/2015.
 */

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: './',
            srcPath: './sass/',
            deployPath: './css/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        // Task configuration.
        sass: {
            dist: {
                files: {
                    '<%= meta.deployPath %>frame.css': '<%= meta.srcPath %>main.scss'
                },
                options: {
                    style: 'compressed'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-sass');
    //grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['sass']);
};