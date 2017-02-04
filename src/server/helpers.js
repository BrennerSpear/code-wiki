var request = require('request');
var Promise = require('bluebird');

// Extract URLs from a string
var findUrls = (text) => {
  var source = (text || '').toString();
  var urlArray = [];
  var url;
  var matchArray;
  // Regular expression to find FTP, HTTP(S) and email URLs.
  var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
  // Iterate through any URLs in the text.
  while( (matchArray = regexToken.exec( source )) !== null ) {
      var token = matchArray[0];
      urlArray.push( token );
  }
  return urlArray;
}

// make API requests as a proxy for the front end
var externalRequest = {
  // link preview api (http://www.linkpreview.net/)
  linkPreview: function(target, callback) {
    return new Promise(function(resolve, reject) {
      request('http://api.linkpreview.net/?key=58938a7d097b0590f713356c5c1fb7d74a0e589166b5a&q=' + target, function(err, res, body) {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }
}

exports.externalRequest = externalRequest;
exports.findUrls = findUrls;





