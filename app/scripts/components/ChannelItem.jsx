'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var ShowItem = React.createClass({
  propTypes: {
    channel: React.PropTypes.object.isRequired
  },
  handleClick(video) {
    this.props.clickChannel(video);
    // ActionCreator.subscribe(id);
  },
  render() {
    var {channel} = this.props;
    var style = {
      'backgroundImage' : 'url(' + channel.snippet.thumbnails.medium.url + ')' 
    };

    return (
      <li className="channel-item" style={style} onClick={this.handleClick.bind(this, channel)}>
        <div className="inner-channel">
          <span className="channel-name">{channel.snippet.title}</span>
          <span className="add-icon">Play</span>
        </div>
      </li>
    );
  }
});

module.exports = ShowItem;
