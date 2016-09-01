'use strict';

module.exports = {
  format: function(style, date) {
    date = new Date(parseInt(date, 10));
    var output = style.replace(/y{4}|D{2}|M{2}|d{2}|h{2}|H{2}|m{2}|s{2}/g, function (keyword) {
      var result = '';

      switch (keyword) {
      case 'yyyy':
        result = date.getFullYear();
        break;
      case 'MM':
        result = date.getMonth() + 1;
        if (result < 10) {
          result = '0' + result;
        }
        break;
      case 'dd':
        result = date.getDate();
        if (result < 10) {
          result = '0' + result;
        }
        break;
      case 'HH':
        var HH = date.getHours();
        if (HH < 10) {
          result = '0' + HH;
        } else {
          result = HH;
        }
        break;
      case 'hh':
        var hh = date.getHours();
        if (hh > 12) {
          hh = hh - 12;
        }
        if (hh < 10) {
          result = '0' + hh;
        } else {
          result = hh;
        }
        break;
      case 'mm':
        var mm = date.getMinutes();
        if (mm < 10) {
          result = '0' + mm;
        } else {
          result = mm;
        }
        break;
      case 'ss':
        var ss = date.getSeconds();
        if (ss < 10) {
          result = '0' + ss;
        } else {
          result = ss;
        }
        break;
      case 'DD':
        var DD = date.getDay();
        break;
      }
      return result;
    });
    return output;
  }
};