/**
 * grunt closure task
 * Closure Compiler
 *
 * Copyright (c) 2012 Uli Preuss
*/

module.exports = function(grunt) {
	
  var compressor = require('node-minify');

  grunt.registerTask('closure', 'Google Closure Compiler', function() {
		var 
		  path = '../', // we are in grunt directory
		  source_file = grunt.config('closure.source'),
		  output_file = grunt.config('closure.output'),
		  compiled_source = grunt.helper('compiler', path + source_file, path + output_file)
		;
		//grunt.file.write(path + output_file, bookmarklet_source);
   // grunt.log.writeln('xx ' + compiled_source);

  });

  grunt.registerHelper('compiler', function(fileIn, fileOut) {
	
		new compressor.minify({
		    type: 'gcc',
		    fileIn: fileIn,
		    fileOut: fileOut,
		    callback: function(err){
		        console.log(err);
		    }
		});

  });

};
