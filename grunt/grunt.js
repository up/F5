/**
 * F5 gruntfile
*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: [
        'bookmarklet.source.js',
        'grunt/grunt.js',
        'grunt/bookmarklet/task.js'
      ]
    },
    jshint: {
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      }
    },
    closure: {
      source: 'bookmarklet.source.js',
      output: 'bookmarklet.compiled.js'
    },
    bookmarklet: {
      wrap: false,
      copytoclipboard: true, // OS X only 
      source: 'bookmarklet.compiled.js',
      output: 'bookmarklet.js'
    }
  });
	
	grunt.loadTasks('closure');
	grunt.loadTasks('bookmarklet');

  // Default task.
  grunt.registerTask('default', 'lint closure bookmarklet');

};