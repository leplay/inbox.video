'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var ShowItem = React.createClass({
  propTypes: {
    channel: React.PropTypes.object.isRequired
  },
<<<<<<< HEAD
  handleClick(id) {
    ActionCreator.subscribe(id);
=======
  handleClick(video) {
    this.props.clickChannel(video);
    // ActionCreator.subscribe(id);
>>>>>>> master
  },
  render() {
    var {channel} = this.props;
    var style = {
      'backgroundImage' : 'url(' + channel.snippet.thumbnails.medium.url + ')' 
    };

    return (
<<<<<<< HEAD
      <li className="channel-item" style={style} onClick={this.handleClick.bind(this, channel.snippet.channelId)}>
        <div className="inner-channel">
          <span className="channel-name">{channel.snippet.channelTitle}</span>
          <span className="add-icon">Subscribe</span>
=======
      <li className="channel-item" style={style} onClick={this.handleClick.bind(this, channel)}>
        <div className="inner-channel">
          <span className="channel-name">{channel.snippet.title}</span>
          <span className="add-icon">Play</span>
>>>>>>> master
        </div>
      </li>
    );
  }
});

module.exports = ShowItem;
