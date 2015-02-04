var https = require('https');
var versionsUrl = 'https://iojs.org/dist/index.json';
var versionRe = /(\d+)\.(\d+)\.(\d+)/;

module.exports = function isGreen(callback) {
  https.get(versionsUrl, function getCb(res) {
    if (res.statusCode !== 200) {
      return callback(new Error('unexpected response code ' + res.statusCode));
    }

    var body = '';
    var versions;

    res.on('error', callback);

    res.on('data', function(data) {
      body += data;
    });

    res.on('end', function() {
      try {
        versions = JSON.parse(body);
      } catch (err) {
        return callback(err);
      }

      if (!(Array.isArray(versions) && versions.length)) {
        return callback(new Error('no versions received'));
      }

      // Assume that the first element is the most recent release
      // If that changes, just add a sort or search here
      var latest = versions[0].version;
      var current = process.versions.node;

      try {
        return callback(null, compareVersions(current, latest) !== -1);
      } catch (err) {
        return callback(err);
      }
    });
  }).on('error', callback);
};

function compareVersions(v1, v2) {
  var v1Parts = v1.match(versionRe);
  var v2Parts = v2.match(versionRe);

  if (v1Parts.length !== 4 || v2Parts.length !== 4) {
    throw new Error('invalid versions in comparison: ' + v1 + ', ' + v2);
  }

  for (var i = 0; i < v1Parts.length; ++i) {
    var v1Part = v1Parts[i] | 0;
    var v2Part = v2Parts[i] | 0;

    if (v1Part < v2Part) {
      return -1; // v2 is greater
    } else if (v1Part > v2Part) {
      return 1;  // v1 is greater
    }
  }

  return 0;      // versions are equal
}
module.exports.compareVersions = compareVersions;
