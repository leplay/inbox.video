'use strict';

var React = require('react');
var WatchItem = require('./WatchItem.jsx');
var Constants = require('../constants/AppConstants');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var Navigation = React.createClass({
  getDefaultProps() {
    return {
      watchlist: []
    };
  },
  componentDidMount: function() {
    if (this.props.user.$identity) {
      setTimeout(function() {
        // ActionCreator.refresh(this.props.watchlist);
      }.bind(this), 3000);
    }
  },
  switchTab: function(tab) {
    if (this.props.user.$identity) {
      switch(tab) {
      case 'browse':
        ActionCreator.getVideoList();
        break;
      case 'likes':
        ActionCreator.showPage(this.props.likes, 'likes');
        break;
      case 'picks':
        ActionCreator.showPage(Constants.Playlists.PICKS, 'picks');
        break;
      case 'profile':
        ActionCreator.showProfile(true);
        break;
      }
    }
  },
  refresh: function() {
    ActionCreator.refresh(this.props.watchlist);
  },
  toggleEditMode: function() {
    ActionCreator.toggleEditMode();
  },
  render() {
    var {watchlist} = this.props;
    var {unwatched} = this.props;
    var {user} = this.props;
    var {likes} = this.props;
    var {editMode} = this.props;
    var {fullScreen} = this.props;
    var {refresh} = this.props;
    var {selectedChannelId} = this.props;
    var className = 'navigation';
    var refreshClass = 'fa fa-refresh fa-fw';
    var centerText = 'Inbox.Video';
    var editClass = '';
    var editText = 'Edit';

    if (fullScreen) {
      className = "navigation hide";
    }

    if (refresh.status) {
      refreshClass = 'fa fa-refresh fa-spin fa-fw';
      centerText = refresh.text ? refresh.text : centerText;
    }

    if (editMode) {
      editClass = 'editing';
      editText = 'Done';
    }

    return (
      <div className={className}>
        <h3>Main</h3>
        <ol className="main">
          <li className={selectedChannelId === 'browse' || selectedChannelId === 'browse-list' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'browse')}>Browse</li>
          <li className={selectedChannelId === 'picks' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'picks')}>Top Picks</li>
          <li className={selectedChannelId === 'likes' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'likes')}>Likes</li>
        </ol>

        <div className="watchlist">
          <h3>Youtube</h3>
          <span className="text-grey">({watchlist.length})</span>
          <span className="text-grey edit-mode" onClick={this.toggleEditMode}>{editText}</span>
          <ul className={editClass}>
            {watchlist.map(channel =>
              <WatchItem key={channel.channelId} ref="item" channel={channel} updated={refresh.status === 2 && refresh.channelId === channel.channelId} isSelected={selectedChannelId === channel.channelId} unwatchedCount={unwatched[channel.channelId] ? unwatched[channel.channelId].length : 0} />
            )}
          </ul>
        </div>

        <div className="control navigation-control">
          <span className={user.$avatar ? 'icon icon-profile' : 'icon icon-profile hide'} onClick={this.switchTab.bind(this, 'profile')}><img src={user.$avatar} alt="profile" /></span>
          <span className="logo">{centerText}</span>
          <span className={watchlist.length ? 'icon icon-setting' : 'icon icon-setting hide'} onClick={this.refresh}><i className={refreshClass}></i></span>
        </div>
      </div>
    );
  }
});

module.exports = Navigation;
