'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var ChannelItem = require('./ChannelItem.jsx');
var Welcome = require('./Welcome.jsx');
var Loading = require('./Loading.jsx');
var Helper = require('./Helper.jsx');

var type = "staffpicks";

var ChannelCenter = React.createClass({
  mixin: [Loading, Helper],
  getDefaultProps: function() {
    return {
      channels: []
    };
  },
  componentWillMount: function() {
    // ActionCreator.getChannelList(type);
  },
  search: function() {
    var keyword = React.findDOMNode(this.refs.search).value;
    if (keyword) {
      ActionCreator.search(keyword);
    }
  },
  onKeyDown: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.search();
    }
  },
  loadCenter: function(type) {
    ActionCreator.getChannelList(type);
    React.findDOMNode(this.refs.search).value = '';
  },
  typeMapping: {
    'staffpicks': '编辑精选',
    'tv': '电视剧',
    'varity': '综艺',
    'talkshow': '脱口秀'
  },
  render() {
    var {user} = this.props;
    var {keyword} = this.props;
    var {loading} = this.props;
    var {channels} = this.props;
    var {fullScreen} = this.props;
    var {isSelectedChannel} = this.props;
    var {isSelectedVideo} = this.props;
    var columnTitle = this.typeMapping[type];
    var className = !isSelectedChannel && !fullScreen ? "channel-center" : "channel-center hide";
    var listClass = 'channel-list';
    var noResultClass = 'no-result hide';

    if (loading) {
      listClass += ' hide';
    }

    if (keyword) {
      columnTitle = '搜索「' + keyword + '」的结果'
    }

    if (!channels.length && !loading) {
      noResultClass = 'no-result';
    }

    if (!isSelectedChannel && user.$identity) {
      return (
        <div className={className}>
          <div className="header">
            <h2>Heisenberg</h2>
            <form className="search-form">
              <input ref="search" type="text" onKeyDown={this.onKeyDown} defaultValue={keyword} placeholder="请输入剧集名称" />
              <a href="javascript:void(0)" className="button button-search" onClick={this.search}>搜索</a>
            </form>
          </div>
          <div className="channel-nav">
            <h3>{columnTitle}</h3>
            <ul>
              <li><a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'tv')}>{this.typeMapping['tv']}</a></li>
              <li><a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'varity')}>{this.typeMapping['varity']}</a></li>
              <li><a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'talkshow')}>{this.typeMapping['talkshow']}</a></li>
            </ul>
          </div>
          <ol className={listClass}>
          {channels.map(channel =>
            <ChannelItem channel={channel} isSelected={!isSelectedChannel} />
          )}
          </ol>
          <div className={noResultClass}>
            对不起，暂时没有剧集信息。<a href="javascript:void(0)" onClick={this.loadCenter.bind(this, 'staffpicks')}>返回</a>
          </div>
          <Loading display={loading} />
          <Helper />
        </div>
      );
    } else if (!isSelectedChannel && !user.$identity) {
      return <Welcome />
    } else {
      return (
        <div className="channel-center hide" />
      );
    }
  }
});

module.exports = ChannelCenter;
