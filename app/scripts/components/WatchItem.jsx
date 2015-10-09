'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var ShowItem = React.createClass({
  propTypes: {
    channel: React.PropTypes.object.isRequired
  },
  clickItem: function(channel) {
    ActionCreator.getVideos(channel);
  },
  removeChannel: function(id) {
    ActionCreator.removeChannel(id);
    return false;
  },
  render() {
    var {channel} = this.props;
    var {unwatchedCount} = this.props;
    var {isSelected} = this.props;
    var {updated} = this.props;
    var className = isSelected ? 'watch-item selected' : 'watch-item';

    var countClass;
    unwatchedCount > 0 ? countClass = 'count' : countClass = 'count hide';

    if (updated) {
      className += ' flash animated';
    }

    return (
      <li className={className} ref="item" onClick={this.clickItem.bind(this, channel)}>
        <i className="remove-icon" onClick={this.removeChannel.bind(this, channel.channelId)}></i>
        <span className="channel-name">{channel.title}</span>
        <span className={countClass}>{unwatchedCount}</span>
      </li>
    );
  }
});

module.exports = ShowItem;
