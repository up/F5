/**
 * grunt closure task
 * Closure Compiler
 *
 * Copyright (c) 2012 Uli Preuss
 */

module.exports = function (grunt) {

  var exec = require('child_process').exec;

  grunt.registerTask('closure', 'Google Closure Compiler', function () {
    var
      options = grunt.config('closure.options'),
      wait = this.async(),
      callback = function (msg) {
        grunt.log.writeln(msg);
      }
    ;

    grunt.helper('compiler', options, wait, callback);

  });

  grunt.registerHelper('compiler', function (options, wait, callback) {

    var
      compilation = options.level.compilation,
      warnings = options.level.warnings,
      sources = options.sources,
      files = '', 
      sourcemap
    ;

    for (var i = 0; i < sources.length; i++) {
      files += '--js ' + sources[i];
    }

    var cmd = '' + 
      'java -jar closure/vendor/compiler.jar ' + 
      files + 
      ' --js_output_file ' + options.output + 
      ' --warning_level ' + warnings + 
      ' --compilation_level ' + compilation
    ;

    if (options.sourcemap && options.sourcemap.create && options.sourcemap.output) {
      sourcemap = options.sourcemap.output;
      cmd += ' --create_source_map ' + sourcemap;
    }

    exec(cmd, function (error, stdout, stderr) {
      var msg = '';
      if (error !== null) {
        msg = 'ERRORS: \n' + error;
      } else {
        msg = 'WARNINGS: \n' + stderr;
      }
      callback(msg);
      wait();
    });

  });

};
