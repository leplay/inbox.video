'use strict';

var FormatDate = require('../utils/FormatDate');
module.exports = {
  format: function(video) {
    var name;
    var num;

    if (video.channelType === 'tv') {
      if (video.country === 'CN') {
        if (video.seasonNum === 1) {
          num = '第 ' + video.videoNum + ' 集';
        } else {
          num = '第 ' + video.seasonNum + ' 季 第 ' + video.videoNum + ' 集';
        }
      } else {
        var seasonNum = ('0' + video.seasonNum).slice(-2);
        var videoNum = ('0' + video.videoNum).slice(-2);
        num = 'S' + seasonNum + 'E' + videoNum;
      }

      if (video.cnName || video.name) {
        name = num + ' :「' + (video.cnName || video.name) + '」';
      } else {
        name = video.channelCnName + ' ' + num;
      }

    } else {
      num = '第 ' + FormatDate.format('yyyyMMdd', video.releaseTime) + ' 期';
      if (video.cnName || video.name) {
        name = (video.cnName || video.name);
      } else {
        name = video.channelCnName + ' ' + num;
      }
    }

    return name;
  }
};