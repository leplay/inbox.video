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
      channels: []
    };
  },
  componentDidMount: function() {
    setTimeout(function() {
      if (this.props.user && this.props.user.$identity) {
        ActionCreator.getChannelList(type);
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
    ActionCreator.getChannelList(type);
    React.findDOMNode(this.refs.search).value = '';
  },
  render() {
    var {user} = this.props;
    var {showProfile} = this.props;
    var {keyword} = this.props;
    var {loading} = this.props;
    var {channels} = this.props;
    var {fullScreen} = this.props;
    var {isSelectedChannel} = this.props;
    var {isSelectedVideo} = this.props;
    var className = !isSelectedChannel && !fullScreen ? "channel-center" : "channel-center hide";
    var listClass = 'channel-list';
    var noResultClass = 'no-result hide';

    if (loading) {
      listClass += ' hide';
    }

    if (keyword) {
      columnTitle = 'Results for ' + keyword;
    }

    if (!channels.length && !loading) {
      noResultClass = 'no-result';
    }

    if (!isSelectedChannel && user.$identity && !showProfile) {
      return (
        <div className={className}>
          <div className="header">
            <h2>Inbox.Video</h2>
            <form className="search-form hide">
              <input ref="search" type="text" onKeyDown={this.onKeyDown} defaultValue={keyword} placeholder="" />
              <a href="javascript:void(0)" className="button button-search" onClick={this.search}>Search</a>
            </form>
          </div>
          <ol className={listClass}>
          {channels.map(channel =>
            <ChannelItem channel={channel} isSelected={!isSelectedChannel} />
          )}
          </ol>
          <div className={noResultClass}>
            Sorry, no results.<a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'staffpicks')}>Back</a>
          </div>
          <Loading display={loading} />
          <Helper />
        </div>
      );
    } else if (!isSelectedChannel && !user.$identity) {
      return <Welcome />
    } else if (!isSelectedChannel && showProfile) {
      return <Profile user={user} />
    } else {
      return (
        <div className="channel-center hide" />
      );
    }
  }
});

module.exports = ChannelCenter;
