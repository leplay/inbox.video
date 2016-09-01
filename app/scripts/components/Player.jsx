'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var QueryString = require('../utils/QueryString');
var targetUrl;
var param = parseInt(QueryString.query('god'));    


var Player = React.createClass({
  componentWillUpdate: function(nextProps, nextState) {
    var url = nextProps.url;
    if (url && targetUrl !== url) {
      var container = React.findDOMNode(this.refs.player);
      var beforePlay = React.findDOMNode(this.refs.beforePlay);
      container.className = 'invisible';
      beforePlay.className = 'before-play';
      var embed = document.getElementById('embed-player');
      if (embed) {
        container.innerHTML = '';
      }
      if (url) {
        var timestamp = (new Date().getTime()).toString();
        var newEmbed = document.createElement('iframe');
        newEmbed.setAttribute('id', 'embed-player');
        newEmbed.setAttribute('src', url);
        newEmbed.setAttribute('frameborder', '0');
        newEmbed.setAttribute('allowFullScreen', 'true');
        container.appendChild(newEmbed);
      }
      setTimeout(function() {
        beforePlay.className = 'before-play hide';
        container.className = '';
      }, 1000);
    }
  },
  clickPlayer: function(url) {
    var provider = ActionCreator.getProvider(url);
    mixpanel.track('CLICK_PLAYER', {provider: provider});
  },
  openPlayer: function(url) {
    ActionCreator.openLink(url);
  },
  render() {
    var {url} = this.props;
    var {fullScreen} = this.props;
    targetUrl = url;
    var className = "player-container";
    if (fullScreen) {
      className = "player-container fullscreen";
    }

    return (
      <div className={className}>
        <div id="player" ref="player" className="invisible" onMouseDown={this.clickPlayer.bind(this, url)}></div>
        <div ref="beforePlay" className="before-play">
          <span className="icon icon-loading"><i className="fa fa-spinner fa-pulse fa-5x"></i></span>
        </div>
      </div> 
    );
  }
});

module.exports = Player;
