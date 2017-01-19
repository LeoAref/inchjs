'use strict';

var THIRD_PARTY_JSON_NAMESPACE = 'inch',
    fs = require('fs'),
    jsyaml = require('js-yaml'),
    Path = require('path'),
    glob = require('glob');

function get() {
  return loadJsonConfig('inch.json') ||
          loadJsonConfig('package.json', THIRD_PARTY_JSON_NAMESPACE) ||
          loadJsonConfig('bower.json', THIRD_PARTY_JSON_NAMESPACE) ||
          loadYamlConfig('.inch.yml') ||
          {};
}

function files() {
  var files = get().files || {};
  return {
    files: files,
    resolvedFiles: resolveFiles(files)
  };
}

function resolveFiles(files) {
  // Contiue if we have "included" files
  if (files.included) {
    var includedFiles = files.included.reduce(function(resolvedFiles, file) {
      return resolvedFiles.concat(glob.sync(getLocalFilename(file), { nodir: true }));
    }, []);

    // If we have "excluded" files, so we need to filter them out
    if (files.excluded) {
      var excludedFiles = files.excluded.reduce(function(resolvedFiles, file) {
        return resolvedFiles.concat(glob.sync(getLocalFilename(file), { nodir: true }));
      }, []);

      return includedFiles.filter(function(file) {
        return excludedFiles.indexOf(file) === -1;
      });
    } else {
      return includedFiles;
    }
  } else {
    return [];
  }
}

function loadJsonConfig(_filename, namespace) {
  var filename = getLocalFilename(_filename);
  if( fs.existsSync(filename) ) {
    var hash = require(filename);
    if( namespace ) hash = hash[namespace]
    return hash;
  }
}

function loadYamlConfig(_filename, namespace) {
  var filename = getLocalFilename(_filename);
  if( fs.existsSync(filename) ) {
    var data = fs.readFileSync(filename);
    var hash = jsyaml.load(data);
    return hash;
  }
}

function getLocalFilename(filename) {
  return Path.join(process.cwd(), filename);
}

module.exports = {
  get: get,
  files: files
};
