'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var VideoItem = require('./VideoItem.jsx');
var $ = require('jquery');
var _ = require('underscore');

var channelId;
var videoIds = [];

var VideoList = React.createClass({
  getDefaultProps() {
    return {
      videos: []
    };
  },
  componentDidMount: function() {
    var checkbox = $('.checkbox');
    var lastId;
    $('.videos').on('click', '.checkbox', function(e){
      var id = parseInt($(this).val());
      if (e.shiftKey && lastId) {
        var start = videoIds.indexOf(id);
        var end = videoIds.indexOf(lastId);
        var arr = new Array(Math.abs(end - start));
        _.each(arr, function(item, index) {
          var small = Math.min(start, end);
          var range = small + index + 1;
          var value = videoIds[range];
          $('.checkbox[value=' + value + ']').prop('checked', true);
        });
      }
      lastId = id;
    });
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (nextProps.currentChannel.channelId !== channelId) {
      React.findDOMNode(this.refs.videos).scrollTop = 0;
    }
  },
  toggleSelectMode: function() {
    if (!this.props.selectMode) {
      $('.checkbox').prop('checked', false);
    }
    ActionCreator.toggleSelectMode();
    videoIds = _.pluck(this.props.videos, 'id');
  },
  selectAll: function() {
    var arr = new Array(this.props.videos.length);
    _.each(arr, function(item, index) {
      var value = videoIds[index];
      $('.checkbox[value=' + value + ']').prop('checked', true);
    });
  },
  markAs: function(status) {
    var ele = $('.checkbox:checked');
    var vals = [];
    ele.each(function() {
      vals.push(parseInt($(this).val()));
    });
    ActionCreator.updateVideoStatus(this.props.currentChannel.channelId, vals, status);
  },
  render() {
    var {videos} = this.props;
    var {watchedItems} = this.props;
    var {selectedVideoId} = this.props;
    var {selectMode} = this.props;
    var {fullScreen} = this.props;
    var {currentChannel} = this.props;
    var className = videos.length && !fullScreen ? "videos" : "videos hide";
    var selectCopy = 'Select';
    var countClass;
    var markClass;
    var listClass;
    var selectAllClass = 'select-all';
    var statusStyle = {
      backgroundImage: 'url(' + currentChannel.thumbnail + ')'
    };
    console.log(statusStyle)

    channelId = currentChannel.channelId;
    if (selectMode) {
      countClass = 'hide';
      listClass = 'selecting';
      selectCopy = 'Done';
    } else {
      markClass = 'hide';
      selectAllClass += ' hide';
    }
    console.log(currentChannel);
    return (
      <div className={className} ref="videos">
        <div className="status" style={statusStyle}>
          <span className="text">{currentChannel.title}</span>
        </div>
        <ol className={listClass}>
          {videos.map(video =>
            <VideoItem video={video} currentChannel={currentChannel.title} selectMode={selectMode} selectedVideoId={selectedVideoId} isWatched={watchedItems.indexOf(video.id) >= 0} />
          )}
        </ol>
        <div className="control videos-control">
            <span className="select-mode" onClick={this.toggleSelectMode}>{selectCopy}</span>
            <span className={countClass}>{currentChannel.totalItemCount} Videos</span>
            <div className={markClass}>
              <span className="mark-button" onClick={this.markAs.bind(this, 'watched')}>Watched</span>
              <span className="mark-button" onClick={this.markAs.bind(this, 'unwatched')}>Unwatched</span>
            </div>
            <span className={selectAllClass} onClick={this.selectAll}>All</span>
        </div>
      </div>
    );
  }
});

module.exports = VideoList;
