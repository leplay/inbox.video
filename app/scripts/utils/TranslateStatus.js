'use strict';

module.exports = {
  translate: function(channel) {
    switch(channel.status) {
    case 'end':
      return '已完结';
      break;
    case 'season_end':
      return '本季已完结';
      break;
    case 'airing':
      if (channel.showTime) {
        return channel.showTime;
      } else {
        return '正在热播';
      }
      break;
    default:
      if (channel.showTime) {
        return channel.showTime;
      } else {
        return '播出信息未知';
      }
      break;
    }

  }
};