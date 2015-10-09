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
    gapi.load('auth2', function() {
      var auth2 = gapi.auth2.init(Constants.AuthObj);
      auth2.isSignedIn.listen(this.statusListener)
    }.bind(this));
    HeisenbergStore.addChangeListener(this._onChange);
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
    return (
      <div className="heisenberg-app">
        <Navigation watchlist={this.state.watchlist} watched={this.state.watched} selectedChannelId={this.state.selectedChannelId} fullScreen={this.state.fullScreen} editMode={this.state.editMode} refresh={this.state.refresh} />
        <VideoList videos={this.state.videos} watchedItems={this.state.watched[this.state.selectedChannelId]} selectedVideoId={this.state.selectedVideoId} fullScreen={this.state.fullScreen} currentChannel={this.state.selectedChannel} selectMode={this.state.selectMode} />
        <Detail detail={this.state.detail} isWatched={this.state.selectedVideoId ? this.state.watched[this.state.selectedChannelId].indexOf(this.state.selectedVideoId) >= 0 : false} isSelectedChannel={this.state.selectedChannelId} fullScreen={this.state.fullScreen} currentChannel={this.state.selectedChannel} />
        <ChannelCenter keyword={this.state.keyword} user={this.state.user} loading={this.state.loading} channels={this.state.channelList} isSelectedChannel={this.state.selectedChannelId} isSelectedVideo={this.state.selectedVideoId} fullScreen={this.state.fullScreen} />
     </div>
    );
  }

});

module.exports = App;
