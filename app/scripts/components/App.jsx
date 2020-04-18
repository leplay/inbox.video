'use strict';

var React = require('react');
var HeisenbergStore = require('../stores/HeisenbergStore');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var Navigation = require('./Navigation.jsx');
var VideoList = require('./VideoList.jsx');
var Detail = require('./Detail.jsx');
var ChannelCenter = require('./ChannelCenter.jsx');
var Constants = require('../constants/AppConstants');

var App = React.createClass({
  getInitialState: function() {
    return HeisenbergStore.getAll();
  },
  _onChange: function() {
    this.setState(HeisenbergStore.getAll());
  },
  componentDidMount: function() {
    HeisenbergStore.addChangeListener(this._onChange);
    window.initGoogleAuth = function () {
      gapi.load('auth2', function() {
        gapi.auth2.authorize(Constants.AuthObj, function(response) {
          if (response.error) {
            return
          }
          window.token = {
            id: response.access_token,
            expiresAt: parseInt(response.expires_at) * 1000
          }
          ActionCreator.getVideoList()
        })
      }.bind(this))
    }

    // var hidden = 'hidden';
    // if (hidden in document) {
    //   document.addEventListener('visibilitychange', onchange);
    // } else if ((hidden = 'mozHidden') in document) {
    //   document.addEventListener('mozvisibilitychange', onchange);
    // } else if ((hidden = 'webkitHidden') in document) {
    //   document.addEventListener('webkitvisibilitychange', onchange);
    // } else if ((hidden = 'msHidden') in document) {
    //   document.addEventListener('msvisibilitychange', onchange);
    // } else if ('onfocusin' in document) {
    //   document.onfocusin = document.onfocusout = onchange;
    // } else {
    //   window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    // }

    // function onchange (evt) {
    //   evt = evt || window.event;
    //   if (evt.type === 'focus' || evt.type === 'focusin' || evt.type === 'pageshow' || !this[hidden]) {
    //     ActionCreator.getToken();
    //   }
    // }
  },
  statusListener: function(bool) {
    if(bool) {
      ActionCreator.getToken();
    }
  },
  componentWillUnmount: function() {
    HeisenbergStore.removeChangeListener(this._onChange);
  },
  render() {
    var { watchlist, unwatched, likes, videos, user, keyword, fullScreen, editMode, selectMode, loading, refresh, selectedChannel, selectedChannelId, selectedVideoId } = this.state;

    var isPlaylist = ActionCreator.isPlaylist(selectedChannelId);
    var isWatched = true;
    if (selectedChannelId && !isPlaylist && (selectedChannelId !== 'profile')) {
      isWatched = unwatched[selectedChannelId].indexOf(selectedVideoId) < 0;
    }
    return (
      <div className="heisenberg-app">
        <Navigation watchlist={watchlist} unwatched={unwatched} likes={likes} selectedChannelId={selectedChannelId} fullScreen={fullScreen} editMode={editMode} refresh={refresh} user={user} />
        <VideoList videos={videos} unwatchedItems={unwatched[selectedChannelId]} selectedChannelId={selectedChannelId} selectedVideoId={selectedVideoId} fullScreen={fullScreen} currentChannel={selectedChannel} selectMode={selectMode} />
        <Detail watchlist={watchlist} detail={this.state.detail} likes={likes} isWatched={isWatched} selectedChannelId={selectedChannelId} fullScreen={fullScreen} currentChannel={selectedChannel} />
        <ChannelCenter keyword={keyword} user={user} loading={loading} videos={videos} selectedChannel={selectedChannel} selectedChannelId={selectedChannelId} isSelectedVideo={selectedVideoId} fullScreen={fullScreen} />
     </div>
    );
  }

});

module.exports = App;
