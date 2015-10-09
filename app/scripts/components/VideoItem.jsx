'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var FormatDate = require('../utils/FormatDate');

var videoItem = React.createClass({
  propTypes: {
    video: React.PropTypes.object.isRequired,
    currentChannel: React.PropTypes.object.isRequired
  },
  clickVideo: function(id) {
    ActionCreator.getVideo(id);
  },
  render() {
    var {video} = this.props;
    var {isWatched} = this.props;
    var {selectedVideoId} = this.props;
    var {currentChannel} = this.props;
    var {selectMode} = this.props;
    var isSelected = selectedVideoId === video.snippet.resourceId.videoId;
    var className = isSelected ? 'video selected' : 'video';
    var checkboxClass = selectMode ? 'checkbox' : 'checkbox hide';

    var updateTime = FormatDate.format('yyyy-MM-dd HH:mm', new Date(video.snippet.publishedAt).getTime());

    if (!isWatched) {
      className += ' unwatched';
    }

    return (
      <li className={className}>
        <input className={checkboxClass} value={video.snippet.resourceId.videoId} type="checkbox" />
        <div className="block" onClick={this.clickVideo.bind(this, video.snippet.resourceId.videoId)}>
          <p className="video-title">{video.snippet.title.length > 66 ? video.snippet.title.substr(0, 66) + '...' : video.snippet.title}</p>
          <span className="update-date">{updateTime}</span>
        </div>
      </li>
    );
  }
});

module.exports = videoItem;
