'use strict';

var React = require('react');
var _ = require('lodash');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var Tip = React.createClass({
  clickLink: function(url) {
    ActionCreator.openLink(url);
  },
  render() {
    var random = _.random(3);
    if (random === 0) {
      return (
        <p>🖖 Inbox.Video is an open source project, let's <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'https://github.com/inboxvideo/inbox.video/blob/master/CONTRIBUTING.md')}>build it together</a>.</p>
      );
    } else if (random === 1){
      return (
        <p>📱 Follow us on <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'https://twitter.com/inboxvideo')}>twitter</a>.</p>
      );
    } else {
      return (
        <p>Made with <i className="fa fa-heartbeat fa-fw"></i> by <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'http://leplay.net/')}>Leplay</a> in Beijing.</p>
      );      
    }

  }
});

module.exports = Tip;
