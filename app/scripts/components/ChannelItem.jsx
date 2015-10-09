'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var ShowItem = React.createClass({
  propTypes: {
    channel: React.PropTypes.object.isRequired
  },
  handleClick(id) {
    ActionCreator.addToWatchlist(id);
  },
  render() {
    var {channel} = this.props;
    var {isSelected} = this.props;
    var style = {
      'backgroundImage' : 'url(' + channel.cover + ')' 
    };

    return (
      <li className="channel-item" style={style} onClick={this.handleClick.bind(this, channel.channelId)}>
        <div className="inner-channel">
          <span className="channel-name">{channel.cnName}</span>
          <span className="add-icon">添加</span>
        </div>
      </li>
    );
  }
});

module.exports = ShowItem;
