'use strict';

var restler = require('restler')
  , fs = require('fs')
  , _ = require("lodash")
  , Promise = require('promise')
;

var getExtension = function(url) {
  var parts = /\.[^.:\/]+$/.exec(url.replace(/\?.*/, ''))
  return parts || ''
}
, echoExec = function(command, options, callback) {
  // executes and logs the command
  console.log(command)
  return require('child_process').exec(command, options, callback)
}

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

module.exports = {
  // downloads a file from the Internet
  // transforms it
  // options:
  //    - file:
  //      - url
  //      - originalFileName
  //      - proccesedFileName
  //      - name
  //    - vectorToPng
  //    - toPng
  download: function(options) {
    return new Promise(function(resolve, reject) {
      var file = options.file;
      var extension = getExtension(file.url)
      , originalFilename = _.template(options.originalFilename, {
        extension: extension
      })

      // if url is not empty
      if (!file.url || file.url.replace(/ /, "") == 'N/A') {
        reject('Error: Url is empty', file);
        return;
      } 

      // and we don't have it yet
      if (fs.existsSync(originalFilename)) {
        resolve(originalFilename);
        return;
      }

      // download and do some magic
      console.log("File download for " + file.name + " from " + file.url);
      restler.get(file.url).on('complete', function(data, response) {
        if (data instanceof Error) {
          reject('Error:', data);
          return;
        }

        fs.writeFile(originalFilename, response.raw, function(err) { 
          if (err) {
            throw err 
          } 

          var files = { 
            originalFilename: originalFilename, 
            processedFilename: options.processedFilename
          }

          var conversionDoneCallback = function(error, stdout, stderr) {
            if (error) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              console.log('Error: ' + error);
              reject('Error:', error);
            }
            resolve(originalFilename);
          }
          if (extension == '.svg' || extension == '.ai' || extension == '.eps') {
            // vector to png
            echoExec(_.template(options.vectorToPng, files, conversionDoneCallback));
          } else {
            // jpg|png|whatever to png
            echoExec(_.template(options.toPng, files, conversionDoneCallback));
          }

        });

      })
      
    })
  }
}