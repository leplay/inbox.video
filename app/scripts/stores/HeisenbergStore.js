'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');
var BaseStore = require('./BaseStore');
var assign = require('object-assign');
var Storage = require('../utils/Storage');
var $ = require('jquery');
var _ = require('underscore');

var _watchlist = Storage.getData('watchlist') || [];
var _unwatched = Storage.getData('unwatched') || {};
var _user = Storage.getData('user') || {};
var _likes = Storage.getData('likes') || {};
var _videos = [];
var _detail = {};
var _selectedChannel = {};
var _selectedChannelId = 'browse';
var _selectedVideoId = false;
var _editMode = false;
var _selectMode = false;
var _fullScreen = false;
var _loading = true;
var _keyword = '';
var _refresh = {
  status: 0,
  channelId: 0,
  text: ''
};


function addItem(channel) {
  var id = channel.channelId;
  var ids = _.pluck(_watchlist, 'channelId');

  if (ids.indexOf(id) < 0) {
    _watchlist.splice(0, 0, channel);
    if (!(id in _unwatched)) {
      _unwatched[id] = [];
    }
  } else {
    console.log('Channel already exist.');
  }
}
function removeItem(id) {
  var ids = _.pluck(_watchlist, 'channelId');
  var index = ids.indexOf(id);
  _watchlist.splice(index, 1);
  _unwatched[id] = [];
}

function markAs(videos, status) {
  if (!videos.length) {
    return false;
  }

  var id = videos[0].snippet.channelId;
  if (!(id in _unwatched)) {
    _unwatched[id] = [];
  }
  _.each(videos, function(video) {
    if (status === 'unwatched') {
      _unwatched[id].push(video.id);
    }
  });
}

var HeisenbergStore = assign({}, BaseStore, {
  getAll() {
    return {
      watchlist: _watchlist,
      unwatched: _unwatched,
      videos: _videos,
      user: _user,
      likes: _likes,
      detail: _detail,
      keyword: _keyword,
      selectedChannel: _selectedChannel,
      selectedChannelId: _selectedChannelId,
      selectedVideoId: _selectedVideoId,
      selectMode: _selectMode,
      editMode: _editMode,
      fullScreen: _fullScreen,
      loading: _loading,
      refresh: _refresh
    };
  },
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
      case Constants.ActionTypes.ADD_CHANNEL:
        _.each(action.channelList, function(channel) {
          delete channel['newItemCount']
          addItem(channel);
        });
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {count: action.channelList.length});
        Storage.updateData('watchlist', _watchlist);
        Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.REMOVE_CHANNEL:
        removeItem(action.id);
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {channelId: action.id});
        Storage.updateData('watchlist', _watchlist);
        Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.LOAD_VIDEOS:
        _selectedVideoId = false;
        _selectMode = false;
        _detail = {};
        var channel = action.channel;
        var data = action.data;
        var isLikesPage = channel.channelId === 'likes';
        var isPlaylist = _.contains(['likes', 'picks'], channel.channelId);
        if (isLikesPage && data.items.length === data.pageInfo.totalResults) {
          _likes.videos = {};
        }

        _.each(data.items, function(video) {
          var publishedAt = new Date(video.snippet.publishedAt).getTime();
          if (isLikesPage) {
            _likes.videos[video.snippet.resourceId.videoId] = video.id;
          } else if (!isPlaylist && publishedAt > channel.updatedAt) {
            var arr = _unwatched[channel.channelId];
            arr.push(video.snippet.resourceId.videoId);
            _unwatched[channel.channelId] = arr;
          }
        });

        channel.totalItemCount = data.pageInfo.totalResults;
        channel.updatedAt = new Date().getTime();

        if (!isLikesPage) {
          var index = _watchlist.indexOf(channel.channelId);
          _watchlist[index] = channel;            
        }

        if (_selectedChannel.nextPageToken && _selectedChannel.channelId === action.channel.channelId) {
          _videos = _videos.concat(data.items);
        } else {
          _videos = data.items;
        }
        _selectedChannelId = channel.channelId;
        _selectedChannel = channel;
        _selectedChannel.nextPageToken = data.nextPageToken;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {id: _selectedChannelId});
        Storage.updateData('likes', _likes);
        Storage.updateData('watchlist', _watchlist);
        Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.LOADING:
        _loading = true;
        HeisenbergStore.emitChange();
        break;
      case Constants.ActionTypes.INIT_LIKES:
        _likes = action.data;
        _likes.videos = {};
        // _unwatched[_likes.playlistId] = [];
        Storage.updateData('likes', _likes);
        // Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.LOAD_DETAIL:
        _detail = action.data;
        _selectedVideoId = _detail.id;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {id: _selectedVideoId});
        break;
      case Constants.ActionTypes.TOGGLE_EDIT_MODE:
        _editMode = !_editMode;
        HeisenbergStore.emitChange();
        break;
      case Constants.ActionTypes.TOGGLE_SELECT_MODE:
        _selectMode = !_selectMode;
        if (_selectMode) {
          _detail = {};
          _selectedVideoId = false;
        }
        HeisenbergStore.emitChange();
        break;
      case Constants.ActionTypes.TOGGLE_FULL_SCREEN:
        _fullScreen = !_fullScreen;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type);
        break;
      case Constants.ActionTypes.OPEN_LINK:
        var url = action.url;
        if (url) {
          if (typeof MacGap !== 'undefined') {
            MacGap.openURL(url);
          } else {
            var target = $('<a>').attr({href: url, target: '_blank'});
            target[0].click();
          }
          mixpanel.track(action.type, {url: action.url});
        }
        break;
      case Constants.ActionTypes.MARK_AS:
        var channelId = action.channelId;
        var videoIds = action.videoIds;
        var status = action.status;
        var arr = _unwatched[channelId];

        if (status === 'unwatched') {
          arr = arr.concat(videoIds);
          arr = _.uniq(arr);
        } else {
          _.each(videoIds, function(id) {
            var index = arr.indexOf(id);
            arr.splice(index, 1);
          });
        }
        _unwatched[channelId] = arr;
        HeisenbergStore.emitChange();
        if (!action.isInit) {
          mixpanel.track(status.toUpperCase() , {id: videoIds.join(',')});
        }
        Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.CREATE_IDENTITY:
        var now = new Date();
        _user.$email = action.email;
        _user.$created = now;
        _user.$last_login = now;
        _user.$name = action.name;
        _user.$identity = action.id;
        HeisenbergStore.emitChange();
        mixpanel.identify(_user.$identity);
        mixpanel.track('PAGEVIEW');
        mixpanel.people.set(_user);
        _user.$avatar = action.avatar;
        Storage.updateData('user', _user);
        break;
      case Constants.ActionTypes.REFRESH:
        var videos = action.data;
        var index = action.index;

        if (index === -1) {
          _refresh.status = 0;
        } else {
          _refresh.status = 1;
          _refresh.text = 'Updating...';
        }

        if (videos) {
          var lastestPublish = new Date(videos[0].snippet.publishedAt).getTime();
          var channelId = _watchlist[index].channelId;
          _refresh.channelId = channelId;
          _refresh.status = 1;
          _refresh.text = 'Updating ' + _watchlist[index].title.substr(0, 15) + '...';

          if (lastestPublish > _watchlist[index].updatedAt) {
            _refresh.status = 2;
            _.find(videos, function(video) {
              var arr = _unwatched[channelId];
              arr.push(video.snippet.resourceId.videoId);
              _unwatched[channelId] = arr;
              return video.snippet.publishedAt < _watchlist[index].updatedAt;
            });
          }

          _watchlist[index].updatedAt = new Date().getTime();
          _watchlist[index].totalItemCount = action.totalItemCount

          if (index === _watchlist.length) {
            _refresh.status = 0;
            mixpanel.track(action.type);
          }
        }

        HeisenbergStore.emitChange();
        Storage.updateData('watchlist', _watchlist);
        Storage.updateData('unwatched', _unwatched);
        break;
      case Constants.ActionTypes.LOAD_CHANNEL_CENTER:
        _videos = action.data.items;
        _selectedChannelId = 'browse';
        _selectedChannel = {
          id: 'browse',
          title: 'Browse',
          category: action.category,
          totalItemCount: action.data.pageInfo.totalResults,
          nextPageToken: action.data.nextPageToken
        };
        _selectedVideoId = false;
        _detail = {};
        _keyword = '';
        _loading = false;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {category: action.category});
        break;
      case Constants.ActionTypes.TO_LIST_VIEW:
        if (_selectedChannelId === 'browse-list' && action.category === _selectedChannel.category) {
          _videos = _videos.concat(action.data.items)
        } else {
          _videos = action.data.items;
        }
        _selectedChannel.nextPageToken = action.data.nextPageToken;
        _selectedChannelId = 'browse-list';
        _selectedChannel.id = 'browse-list';
        _selectedVideoId = action.selectedVideo ? action.selectedVideo.id : false;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type);
        break;
      case Constants.ActionTypes.SHOW_PAGE:
        _selectedChannelId = action.page;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type);
        break;
      case Constants.ActionTypes.LIKE:
        if (action.id in _likes.videos) {
          delete _likes.videos[action.id];
        } else {
          _likes.videos[action.id] = action.playlistItemId;
        }
        Storage.updateData('likes', _likes);
        HeisenbergStore.emitChange();
        mixpanel.track(action.type);
        break;
      case Constants.ActionTypes.SEARCH:
        if (_keyword === action.keyword) {
          _videos = _videos.concat(action.data.items);
        } else {
          _videos = action.data.items;
        }
        _keyword = action.keyword;
        _selectedChannelId = 'search';
        _selectedChannel = {
          id: 'search',
          keyword: _keyword,
          title: 'Searching ' + _keyword,
          nextPageToken: action.data.nextPageToken,
          totalItemCount: action.data.pageInfo.totalResults
        };

        _loading = false;
        HeisenbergStore.emitChange();
        mixpanel.track(action.type, {keyword: _keyword});
        break;
    }
  })

});

module.exports = HeisenbergStore;
