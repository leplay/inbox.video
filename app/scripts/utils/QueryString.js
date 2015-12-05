'use strict';

module.exports = {
  query: function(key, str) {
    var QUERYSTRING_PATTERN_PREFIX = '[\\?\\&\\#]';
    var QUERYSTRING_PATTERN_SUFFIX = '=([^&]*)';
    str = str || window.location.search;
    var matches = str.match(new RegExp(QUERYSTRING_PATTERN_PREFIX + key + QUERYSTRING_PATTERN_SUFFIX, 'i'));
    var encodedValue = matches && matches[1];
    var value = encodedValue && decodeURIComponent(encodedValue);
    return value;
  }
};