'use strict';

module.exports = {
  getData: function(name) {
    var data = localStorage.getItem(name);
    if (name && data) {
      return JSON.parse(data);
    }
    return null;
  },
  updateData: function(name, data) {
    if (name && data) {
      var str = JSON.stringify(data);
      localStorage.setItem(name, str);
    }
  }
};