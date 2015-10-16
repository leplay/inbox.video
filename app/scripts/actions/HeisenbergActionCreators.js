'use strict';

var $ = require('jquery');
var _ = require('underscore');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

var auth2;
var subscriptions = [];
var token = {};
var channelList = [];
var loopTimes = 0;

module.exports = {
  search: function(keyword) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOADING,
      category: 'SEARCH'
    });

    var access_token = token.id;
    var data = {
      'part': 'snippet',
      'type': 'channel',
      'q': keyword,
      'maxResults': 48,
      'access_token': access_token
    };

    $.ajax({
      url: Constants.ActionUrls.SEARCH,
      data: data,
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.SEARCH,
          keyword: keyword,
          data: resp.items
        });
      } else {
        console.log('ajax error');
      }
    });
  },



  getChannelList: function(type) {
    var access_token = token.id;
    if (!access_token) {
      this.getToken(this.getChannelList);
      return false;
    }

    if (type === undefined) {
      type = 'mostPopular';
    }

    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOADING,
      category: type
    });

    var access_token = token.id;
    var data = {
      'part': 'snippet',
      'chart': type,
      'maxResults': 30,
      'access_token': access_token
    };
    $.ajax({
      url: Constants.ActionUrls.VIDEO,
      data: data,
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_CHANNEL_CENTER,
          category: type,
          data: resp.items
        });
      } else {
        console.log('ajax error');
      }
    });
  },
  removeChannel: function(channel) {
    var access_token = token.id;

    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REMOVE_CHANNEL,
      id: channel.channelId
    });
    $.ajax({
      url: Constants.ActionUrls.SUBSCRIPTIONS + '?id=' + channel.subscriptionId + '&access_token=' + access_token,
      type: 'DELETE',
      xhrFields: {
        withCredentials: true
      }
    });
  },
  markAs: function(channelId, videoIds, status) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.MARK_AS,
      channelId: channelId,
      videoIds: videoIds,
      status: status 
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
  openLink: function(url) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.OPEN_LINK,
      url: url
    });
  },
  generatePlayerUrl: function(id, embed) {
    var url;
    if (!embed) {
      url = 'https://www.youtube.com/watch?v=' + id;
    } else {
      url = 'https://www.youtube.com/embed/' + id;
    }
    return url;
  },
  refresh: function(list) {
    if (!list.length) {
      return false;
    }

    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REFRESH
    });

    var ids = _.pluck(list, 'playlistId');
    var index = 0;
    function loop() {
      setTimeout(function() {
        if (index === ids.length) {
          AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.REFRESH,
            index: -1,
          });
        } else {
          var access_token = token.id;
          var data = {
            'part': 'snippet',
            'maxResults': 15,
            'playlistId': ids[index],
            'access_token': access_token
          };

          $.ajax({
            url: Constants.ActionUrls.PLAYLIST,
            data: data,
            xhrFields: {
              withCredentials: true
            }
          }).done(function(resp) {
            if (resp) {
              AppDispatcher.handleViewAction({
                type: Constants.ActionTypes.REFRESH,
                index: index,
                totalItemCount: resp.pageInfo.totalResults,
                data: resp.items
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
      }, 10);
    }
    loop();
  },
  getVideos: function(channel, next) {
    var access_token = token.id;
    var data = {
      'part': 'snippet,contentDetails',
      'maxResults': 15,
      'playlistId': channel.playlistId,
      'access_token': access_token
    };

    if (next) {
      data.pageToken = next;
    }

    $.ajax({
      url: Constants.ActionUrls.PLAYLIST,
      data: data,
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_VIDEOS,
          data: resp.items,
          next: resp.nextPageToken,
          channel: channel
        });
      } else {
        console.log('ajax error');
      }
    }).fail(function(resp) {
      if (resp.status === 401) {
        this.getToken();
      }
    }.bind(this));
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
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      if (resp) {
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.LOAD_DETAIL,
          data: resp.items[0]
        });
      }
    }).fail(function(resp) {
      if (resp.status === 401) {
        this.getToken();
      }
    }.bind(this));
  },
  getToken: function(callback) {
    var now = new Date().getTime();
    if (!token.id || token.expiresAt < now) {
      gapi.auth.authorize(Constants.AuthObj, function(result) {
        token.id = result.access_token;
        token.expiresAt = parseInt(result.expires_at) * 1000;
        if (callback) {
          callback();
        }
      }.bind(this));
    } else {
      if (callback) {
        callback();
      }
    }
  },
  initWatched: function(channels) {
    _.each(channels, function(channel) {
      var access_token = token.id;
      var data = {
        'part': 'snippet,contentDetails',
        'maxResults': channel.newItemCount,
        'playlistId': channel.playlistId,
        'access_token': access_token
      };

      $.ajax({
        url: Constants.ActionUrls.PLAYLIST,
        data: data,
        xhrFields: {
          withCredentials: true
        }
      }).done(function(resp) {
        if (resp) {
          var videoIds = [];
          _.each(resp.items, function(item) {
            videoIds.push(item.snippet.resourceId.videoId);
          });

          AppDispatcher.handleViewAction({
            type: Constants.ActionTypes.MARK_AS,
            status: 'unwatched',
            channelId: channel.channelId,
            videoIds: videoIds,
            isInit: true
          });
        } else {
          console.log('ajax error');
        }
      });
    });
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
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      if (resp.items.length && resp.nextPageToken) {
        subscriptions = subscriptions.concat(resp.items);
        this.fetchSubscriptions(resp.nextPageToken);
      } else if (resp) {
        subscriptions = subscriptions.concat(resp.items);
        if (subscriptions.length) {
          this.getPlaylistFromChannel(subscriptions, 0);
        }   
      }
    }.bind(this));
  },
  subscribe: function(id) {
    channelList = [];
    var access_token = token.id;
    var resource = {
      snippet: {
        resourceId: {
          kind: 'youtube#channel',
          channelId: id
        }
      }
    };

    $.ajax({
      url: Constants.ActionUrls.SUBSCRIPTIONS + '?part=snippet,contentDetails&access_token=' + access_token,
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(resource),
      withCreditial: true
    }).done(function(resp) {
      if (resp) {
        var arr = [resp];
        this.getPlaylistFromChannel(arr, 0);
      }
    }.bind(this));
  },
  getPlaylistFromChannel: function(list, loop) {
    var channels = list.splice(0, 45);
    var ids = [];
    var access_token = token.id;
    _.each(channels, function(channel) {
      var obj = {};
      obj.subscriptionId = channel.id;
      obj.channelId = channel.snippet.resourceId.channelId;
      obj.provider = 'youtube';
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
      xhrFields: {
        withCredentials: true
      }
    }).done(function(resp) {
      _.each(resp.items, function(item, i) {
        var index = loop*45 + i;
        channelList[index]['playlistId'] = item.contentDetails.relatedPlaylists.uploads;
        channelList[index]['title'] = item.snippet.title;
        channelList[index]['description'] = item.snippet.description;
        channelList[index]['thumbnail'] = item.snippet.thumbnails.high.url;
        channelList[index]['updatedAt'] = new Date().getTime();
      }.bind(this));
      if (list.length > 0) {
        loopTimes++;
        this.getPlaylistFromChannel(list, loopTimes);
      } else {
        if (channelList.length > 1) {
          this.initWatched(channelList);
        }
        AppDispatcher.handleViewAction({
          type: Constants.ActionTypes.ADD_CHANNEL,
          channelList: channelList.reverse()
        });
      }
    }.bind(this));
  },
  showProfile: function(bool) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SHOW_PROFILE,
      bool: bool
    });
  },
  createIdentity: function(profile) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.CREATE_IDENTITY,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      id: profile.id
    });

    this.getChannelList();
  }
};
