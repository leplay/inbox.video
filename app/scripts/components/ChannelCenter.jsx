'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var ChannelItem = require('./ChannelItem.jsx');
var Welcome = require('./Welcome.jsx');
var Profile = require('./Profile.jsx');
var Loading = require('./Loading.jsx');
var Helper = require('./Helper.jsx');

var type = "mostPopular";

var ChannelCenter = React.createClass({
  mixin: [Loading, Helper],
  getDefaultProps: function() {
    return {
      videos: []
    };
  },
  componentDidMount: function() {
    setTimeout(function() {
      if (this.props.user && this.props.user.$identity) {
        ActionCreator.getVideoList(type);
      }
    }.bind(this), 1000);
  },
  search: function() {
    var keyword = React.findDOMNode(this.refs.search).value;
    if (keyword) {
      ActionCreator.search(keyword);
    }
  },
  onKeyDown: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  },
  loadCenter: function(type) {
    ActionCreator.getVideoList(type);
    React.findDOMNode(this.refs.search).value = '';
  },
  clickChannel: function(video) {
    ActionCreator.toListView(this.props.selectedChannel, this.props.videos, video);
  },
  render() {
    var {user} = this.props;
    var {keyword} = this.props;
    var {loading} = this.props;
    var {videos} = this.props;
    var {fullScreen} = this.props;
    var {selectedChannel} = this.props;
    var {selectedChannelId} = this.props;
    var {isSelectedVideo} = this.props;
    var showChannelCenter = false;
    var showProfile = selectedChannelId === 'profile' ? true : false;

    if (selectedChannelId === 'browse' || selectedChannelId === 'profile') {
      showChannelCenter = true;
    }

    var className = showChannelCenter && !fullScreen ? "channel-center" : "channel-center hide";
    var columnTitle;
    var listClass = 'channel-list';
    var noResultClass = 'no-result hide';

    if (loading) {
      listClass += ' hide';
    }

    if (keyword) {
      columnTitle = 'Results for ' + keyword;
      className += ' search';
    }

    if (!videos.length && !loading) {
      noResultClass = 'no-result';
    }

    if (showChannelCenter && user.$identity && !showProfile) {
      return (
        <div className={className}>
          <div className="header">
            <h2>Inbox.Video</h2>
            <form className="search-form">
              <input ref="search" type="text" onKeyDown={this.onKeyDown} defaultValue={keyword} placeholder="Search videos" />
              <a href="javascript:void(0)" className="button button-search" onClick={this.search}>Search</a>
            </form>
          </div>
          <div className="channel-nav">
            <h3>{columnTitle}</h3>
          </div>
          <ol className={listClass}>
          {videos.map(channel =>
            <ChannelItem key={channel.id} channel={channel} clickChannel={this.clickChannel} />
          )}
          </ol>
          <div className={noResultClass}>
            Sorry, no results.<a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'mostPopular')}>Back</a>
          </div>
          <Loading display={loading} />
          <Helper />
        </div>
      );
    } else if (showChannelCenter && !user.$identity) {
      return <Welcome />
    } else if (showChannelCenter && showProfile) {
      return <Profile user={user} />
    } else {
      return (
        <div className="channel-center hide" />
      );
    }
  }
});

module.exports = ChannelCenter;
