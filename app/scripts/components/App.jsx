'use strict';

var React = require('react');
var _ = require('underscore');
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
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', function() {
        var auth2 = gapi.auth2.init(Constants.AuthObj);
        auth2.isSignedIn.listen(this.statusListener)
      }.bind(this));
    }

    var hidden = 'hidden';
    if (hidden in document) {
      document.addEventListener('visibilitychange', onchange);
    } else if ((hidden = 'mozHidden') in document) {
      document.addEventListener('mozvisibilitychange', onchange);
    } else if ((hidden = 'webkitHidden') in document) {
      document.addEventListener('webkitvisibilitychange', onchange);
    } else if ((hidden = 'msHidden') in document) {
      document.addEventListener('msvisibilitychange', onchange);
    } else if ('onfocusin' in document) {
      document.onfocusin = document.onfocusout = onchange;
    } else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }

    function onchange (evt) {
      evt = evt || window.event;
      if (evt.type === 'focus' || evt.type === 'focusin' || evt.type === 'pageshow' || !this[hidden]) {
        ActionCreator.getToken();
      }
    }
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
    var selectedChannelId = this.state.selectedChannelId;
    var selectedVideoId = this.state.selectedVideoId;
    var isPlaylist = ActionCreator.isPlaylist(selectedChannelId);
    var isWatched = true;
    if (selectedChannelId && !isPlaylist) {
      isWatched = this.state.unwatched[selectedChannelId].indexOf(selectedVideoId) < 0;
    }
    return (
      <div className="heisenberg-app">
        <Navigation watchlist={this.state.watchlist} unwatched={this.state.unwatched} likes={this.state.likes} selectedChannelId={this.state.selectedChannelId} fullScreen={this.state.fullScreen} editMode={this.state.editMode} refresh={this.state.refresh} user={this.state.user} />
        <VideoList videos={this.state.videos} unwatchedItems={this.state.unwatched[this.state.selectedChannelId]} selectedChannelId={this.state.selectedChannelId} selectedVideoId={this.state.selectedVideoId} fullScreen={this.state.fullScreen} currentChannel={this.state.selectedChannel} selectMode={this.state.selectMode} />
        <Detail detail={this.state.detail} likes={this.state.likes} isWatched={isWatched} selectedChannelId={this.state.selectedChannelId} fullScreen={this.state.fullScreen} currentChannel={this.state.selectedChannel} />
        <ChannelCenter keyword={this.state.keyword} user={this.state.user} loading={this.state.loading} videos={this.state.videos} selectedChannel={this.state.selectedChannel} selectedChannelId={this.state.selectedChannelId} isSelectedVideo={this.state.selectedVideoId} fullScreen={this.state.fullScreen} />
     </div>
    );
  }

});

module.exports = App;
