'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var FormatDate = require('../utils/FormatDate');
var Player = require('./Player.jsx');
var Helper = require('./Helper.jsx');

var Detail = React.createClass({
  mixin: [Helper],
  getDefaultProps: function() {
    return {
      detail: {}
    };
  },
  handleMark: function(status) {
    ActionCreator.markAs(this.props.currentChannel.channelId, [this.props.detail.id], status);
  },
  share: function() {
    var title = 'Inbox.Video';
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=http%3A%2F%2Finbox.video%2F';
    ActionCreator.openLink(url);
  },
  clickLink: function(url) {
    ActionCreator.openLink(url);
  },
  toggleFullScreen: function() {
    ActionCreator.toggleFullScreen();
  },
  donate: function() {
    React.findDOMNode(this.refs.donation).submit();
  },
  render() {
    var {detail} = this.props;
    var {isWatched} = this.props;
    var {isSelectedChannel} = this.props;
    var {currentChannel} = this.props;
    var {fullScreen} = this.props;

    var detailName = detail.snippet ? detail.snippet.title : '';
    var description = detail.snippet ? detail.snippet.description : '';

    var isSelectedVideo = !!detail.id;
    var url = ActionCreator.generatePlayerUrl(detail.id);
    var playerUrl = ActionCreator.generatePlayerUrl(detail.id, 1);

    var className;
    var tipsClass = 'tips';
    var controlClass = 'control detail-control';


    if (isSelectedChannel && isSelectedVideo) {
      className = 'detail with-bg';
    } else if (isSelectedChannel && !isSelectedVideo) {
      className = 'detail not-select-video';
    } else {
      className = 'detail hide';
    }

    if (fullScreen) {
      controlClass += ' fullscreen-mode';
      tipsClass += ' hide';
    }

    return (
      <div className={className}>
        <div className="content">
          <h2 className="detail-name">{detailName}</h2>
          <p className={isWatched ? "update-date" : "update-date unwatched"}>{FormatDate.format('yyyy-MM-dd HH:mm', detail.snippet ? new Date(detail.snippet.publishedAt).getTime() : 0)}</p>
          <Player url={playerUrl} fullScreen={fullScreen} />
          <p className="source">Source： <a href="javascript:void(0)" onClick={this.clickLink.bind(this, url + '&feature=' + location.hostname)}>{url}</a></p>
          <div className="description">
            <pre className="description-text">{description}</pre>
          </div>
          <Helper />
        </div>
        <div className={controlClass}>
          <span className="icon icon-fullscreen" onClick={this.toggleFullScreen}></span>
          <div className="mark-as">
            Mark as：
           <button className="mark-button" onClick={this.handleMark.bind(this, 'watched')}>Watched</button>
           <button className="mark-button" onClick={this.handleMark.bind(this, 'unwatched')}>Unwatched</button>
          </div>
          <span className="icon icon-share" onClick={this.share}><i className="fa fa-share-square-o"></i></span>
        </div>
        <div className={tipsClass}>
          <p>Made with <i className="fa fa-heartbeat fa-fw"></i> by Leplay. <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'https://twitter.com/leplay_')}>Follow me on twitter</a> or <a href="javascript:void(0)" onClick={this.donate}>make a donation</a>.</p>
          <form className="hide" ref="donation" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </div>
    );

  }
});

module.exports = Detail;
