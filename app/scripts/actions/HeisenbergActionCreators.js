'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');
var $ = require('jquery');
var _ = require('underscore');

var auth2;
var subscriptions = [];
var token = {};
var channelList = [];
var loopTimes = 0;

module.exports = {
  getChannelList: function(type) {
    if (type === undefined) {
      type = 'staffpicks';
    }

    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOADING,
      category: type
    });

    $.ajax({
      url: Constants.ActionUrls.COLLECTION + type,
      data: {
        field: 'id,channelId,cnName,cover,latestVideo,latestRelease'
      },
      dataType: 'json',
      withCreditial: true
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_CHANNEL_CENTER,
          category: type,
          data: resp
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  search: function(keyword) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOADING,
      category: 'SEARCH'
    });
    $.ajax({
      url: Constants.ActionUrls.SEARCH + keyword,
      dataType: 'json',
      data: {
        field: 'id,channelId,cnName,cover,totalCount'
      },
      withCreditial: true
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.SEARCH,
          keyword: keyword,
          data: resp
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  removeChannel: function(id) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REMOVE_CHANNEL,
      id: id
    });
  },
  updateVideoStatus: function(channelId, VideoIds, status) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.UPDATE_VIDEO_STATUS,
      channelId: channelId,
      VideoIds: VideoIds,
      status: status 
    });
  },
  addToWatchlist: function(id) {
    $.ajax({
      url: Constants.ActionUrls.CHANNEL + id,
      dataType: 'json',
      withCreditial: true
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.ADD_CHANNEL,
          channel: resp
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  toggleEditMode: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.TOGGLE_EDIT_MODE
    });
  },
  toggleSelectMode: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.TOGGLE_SELECT_MODE
    });
  },
  toggleFullScreen: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.TOGGLE_FULL_SCREEN
    });
  },
  refresh: function(list) {
    if (!list.length) {
      return false;
    }

    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REFRESH
    });

    var ids = _.pluck(list, 'channelId');
    var index = 0;
    function loop() {
      setTimeout(function() {
        if (index === ids.length) {
          AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REFRESH,
            index: -1,
          });
        } else {
          $.ajax({
            url: Constants.ActionUrls.CHANNEL + ids[index],
            data: {
              field: 'channelId,latestRelease,latestVideo,updatedAt'
            },
            dataType: 'json',
            withCreditial: true
          }).done(function(resp) {
            if (resp) {
              AppDispatcher.handleViewAction({
                type: Constants.ActionTypes.REFRESH,
                index: index,
                data: resp
              });
            } else {
              console.log('ajax error');
            }
            if (index < ids.length) {
              index++;
              loop();
            }
          });
        }
      }, 800);
    }
    loop();
  },
  openLink: function(url) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.OPEN_LINK,
      url: url
    });
  },
  generatePlayerUrl: function(id, embed) {
    var url;
    if (!embed) {
      url = 'https://www.youtube.com/watch?v=' + id + '&feature=' + location.hostname;
    } else {
      url = 'https://www.youtube.com/embed/' + id;
    }
    return url;
  },
  getProvider: function(url) {
    var parser = document.createElement('a');
    parser.href = url;
    var arr = parser.hostname.split('.');
    var provider = arr.slice(-2, -1).join();
    return provider;
  },





  getVideos: function(channel) {
    var access_token = token.id;
    var data = {
      'part': 'snippet,contentDetails',
      'maxResults': 15,
      'playlistId': channel.playlistId,
      'access_token': access_token
    };
    $.ajax({
      url: Constants.ActionUrls.PLAYLIST,
      data: data,
      withCreditial: true
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_VIDOES,
          data: resp.items,
          channel: channel
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  getVideo: function(id) {
    var access_token = token.id;
    var data = {
      'part': 'snippet,player',
      'maxResults': 50,
      'id': id,
      'access_token': access_token
    };
    $.ajax({
      url: Constants.ActionUrls.VIDEO,
      data: data,
      withCreditial: true
    }).done(function(resp) {
      console.log(resp)
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_DETAIL,
          data: resp.items[0]
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  getToken: function() {
    gapi.auth.authorize(Constants.AuthObj, function(result) {
      var now = new Date().getTime();
      token.id = result.access_token;
      token.expiresAt = result.expires_at;
    }.bind(this));
  },
  fetchSubscriptions: function(next) {
    var access_token = token.id;
    var data = {
      'part': 'snippet,contentDetails',
      'mine': true,
      'maxResults': 50,
      'access_token': access_token
    };

    if (next) {
      data.pageToken = next;
    }

    $.ajax({
      url: Constants.ActionUrls.SUBSCRIPTIONS,
      data: data,
      withCreditial: true
    }).done(function(resp) {
      if (resp.items.length && resp.nextPageToken) {
        subscriptions = subscriptions.concat(resp.items);
        this.fetchSubscriptions(resp.nextPageToken);
      } else if (resp) {
        subscriptions = subscriptions.concat(resp.items);
        if (subscriptions.length) {
          this.getPlaylistFromChannel(subscriptions, 0);

        // AppDispatcher.handleViewAction({
        //   type: Constants.ActionTypes.LOAD_CHANNEL_CENTER,
        //   category: type,
        //   data: resp
        // });
        }   
      }
    }.bind(this));
  },
  getPlaylistFromChannel: function(list, loop) {
    var channels = list.splice(0, 45);
    var ids = [];
    var access_token = token.id;
    _.each(channels, function(channel) {
      var obj = {};
      obj.channelId = channel.snippet.resourceId.channelId;
      obj.newItemCount = channel.contentDetails.newItemCount;
      obj.totalItemCount = channel.contentDetails.totalItemCount;
      channelList.push(obj);
      ids.push(channel.snippet.resourceId.channelId);
    });

    var data = {
      'part': 'snippet,contentDetails',
      'id': ids.join(','),
      'maxResults': 50,
      'access_token': access_token
    };
    $.ajax({
      url: Constants.ActionUrls.CHANNEL,
      data: data,
      withCreditial: true
    }).done(function(resp) {
      _.each(resp.items, function(item, i) {
        var index = loop*45 + i;
        channelList[index]['playlistId'] = item.contentDetails.relatedPlaylists.uploads;
        channelList[index]['title'] = item.snippet.title;
        channelList[index]['description'] = item.snippet.description;
        channelList[index]['thumbnail'] = item.snippet.thumbnails.high.url;
      });
      if (list.length > 0) {
        loopTimes++;
        this.getPlaylistFromChannel(list, loopTimes);
      } else {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.IMPORT_CHANNELS,
          channelList: channelList
        });
      }
    }.bind(this));
  },
  createIdentity: function(profile) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.CREATE_IDENTITY,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      id: profile.id
    });
  }

};
