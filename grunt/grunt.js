/**
 * F5 gruntfile
 */

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: [
        '../bookmarklet.source.js',
        'closure/task.js',
        'bookmarklet/task.js',
        'grunt.js' // self
      ]
    },
    jshint: {
      options: {
        browser: true,
        scripturl: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        strict: false
      }
    },
    closure: {
      options: {
        sources: ['../bookmarklet.source.js'],
        output: '../bookmarklet.compiled.js',
        level: {
          compilation: 'ADVANCED_OPTIMIZATIONS', // SIMPLE_OPTIMIZATIONS, WHITESPACE_ONLY
          warnings: 'VERBOSE' // QUIET, DEFAULT
        },
        sourcemap: {
          create: true,
          output: '../bookmarklet.sourcemap.js'
        }
      }
    },
    bookmarklet: {
      wrap: false,
      copytoclipboard: true, // OS X only 
      source: '../bookmarklet.compiled.js',
      output: '../bookmarklet.js'
    }
  });

  grunt.loadTasks('closure');
  grunt.loadTasks('bookmarklet');

  grunt.registerTask('default', 'lint closure bookmarklet');

};
