'use strict';

var formatter = require('./formatter.js'),
    retriever = require('./retriever.js'),
    config = require('./config'),
    jsdoc = require('jsdoc-api');

function run(jsdoc_args, callback) {
  var filesConfig = config.files();

  if(filesConfig.files.length === 0) {
    fail("No sources found.");
  }

  var objects = jsdoc.explainSync({ files: filesConfig.resolvedFiles });
  var formatted = formatter.run(objects, []);
  callback(formatted);
}

function fail(msg) {
  console.error('[InchJS] '+msg);
  process.exit(1);
}

module.exports = {
  run: run
};
