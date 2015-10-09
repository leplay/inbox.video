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
    ActionCreator.updateVideoStatus(this.props.detail.channelId, [this.props.detail.id], status);
  },
  share: function() {
    // To be update
    var title = '我正在银时网观看《' + this.props.currentChannel.cnName + '》，你也来吧！';
    var url = 'http://service.weibo.com/share/share.php?url=http%3A%2F%2Fyinshi.co%3Futm_source%3Dweibo&type=button&ralateUid=5648491282&language=zh_cn&title=' + encodeURIComponent(title) + '&searchPic=false&style=simple';
    ActionCreator.openLink(url);
  },
  clickLink: function(url) {
    ActionCreator.openLink(url);
  },
  toggleFullScreen: function() {
    ActionCreator.toggleFullScreen();
  },
  render() {
    var {detail} = this.props;
    var {isWatched} = this.props;
    var {isSelectedChannel} = this.props;
    var {currentChannel} = this.props;
    var {fullScreen} = this.props;

    var detailName = detail.snippet ? detail.snippet.title : '';
    var isSelectedVideo = !!detail.id;
    var url = ActionCreator.generatePlayerUrl(detail.id);
    var playerUrl = ActionCreator.generatePlayerUrl(detail.id, 1);


    var className;
    var tipsClass = 'tips';
    var controlClass = 'control detail-control';


    if (isSelectedChannel && isSelectedVideo) {
      className = 'detail with-bg';
    } else if (isSelectedChannel && !isSelectedVideo) {
      className = 'detail not-select-Video';
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
          <p className="description"><span>{detail.snippet ? detail.snippet.description : ''}</span></p>
          <Player url={playerUrl} fullScreen={fullScreen} />
          <p className="source">Source： <a href="javascript:void(0)" onClick={this.clickLink.bind(this, url)}>{url}</a></p>
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
          <p>来微博上关注我们吧，我们会在上面发布银时网的最新动态。 <a href="javascript:void(0)" onClick={this.clickLink.bind(this, 'http://weibo.com/yinshico')}>去关注</a></p>
        </div>
      </div>
    );

  }
});

module.exports = Detail;
