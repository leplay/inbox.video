'use strict';

var React = require('react');
var WatchItem = require('./WatchItem.jsx');
<<<<<<< HEAD
=======
var Constants = require('../constants/AppConstants');
>>>>>>> master
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
<<<<<<< HEAD
        ActionCreator.refresh(this.props.watchlist);
=======
        // ActionCreator.refresh(this.props.watchlist);
>>>>>>> master
      }.bind(this), 3000);
    }
  },
  switchTab: function(tab) {
    if (this.props.user.$identity) {
      switch(tab) {
      case 'browse':
<<<<<<< HEAD
        ActionCreator.getChannelList();
        break;
      case 'likes':
        ActionCreator.showLikes(this.props.likes);
=======
        ActionCreator.getVideoList();
        break;
      case 'likes':
        ActionCreator.showPage(this.props.likes, 'likes');
        break;
      case 'picks':
        ActionCreator.showPage(Constants.Playlists.PICKS, 'picks');
>>>>>>> master
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
<<<<<<< HEAD
=======

>>>>>>> master
    return (
      <div className={className}>
        <h3>Main</h3>
        <ol className="main">
<<<<<<< HEAD
          <li className={selectedChannelId === 'browse' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'browse')}>Browse</li>
          <li className={selectedChannelId === likes.channelId ? 'selected' : ''} onClick={this.switchTab.bind(this, 'likes')}>Likes</li>
=======
          <li className={selectedChannelId === 'browse' || selectedChannelId === 'browse-list' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'browse')}>Browse</li>
          <li className={selectedChannelId === 'picks' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'picks')}>Top Picks</li>
          <li className={selectedChannelId === 'likes' ? 'selected' : ''} onClick={this.switchTab.bind(this, 'likes')}>Likes</li>
>>>>>>> master
        </ol>

        <div className="watchlist">
          <h3>Youtube</h3>
          <span className="text-grey">({watchlist.length})</span>
          <span className="text-grey edit-mode" onClick={this.toggleEditMode}>{editText}</span>
          <ul className={editClass}>
            {watchlist.map(channel =>
<<<<<<< HEAD
              <WatchItem ref="item" channel={channel} updated={refresh.status === 2 && refresh.channelId === channel.channelId} isSelected={selectedChannelId === channel.channelId} unwatchedCount={unwatched[channel.channelId] ? unwatched[channel.channelId].length : 0} />
=======
              <WatchItem key={channel.channelId} ref="item" channel={channel} updated={refresh.status === 2 && refresh.channelId === channel.channelId} isSelected={selectedChannelId === channel.channelId} unwatchedCount={unwatched[channel.channelId] ? unwatched[channel.channelId].length : 0} />
>>>>>>> master
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
