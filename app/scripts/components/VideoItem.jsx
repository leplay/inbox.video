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
    var videoId = video.snippet.resourceId ? video.snippet.resourceId.videoId : (typeof video.id === 'object' ? video.id.videoId : video.id);
    var isSelected = selectedVideoId === videoId;
    var className = isSelected ? 'video selected' : 'video';
    var checkboxClass = selectMode ? 'checkbox' : 'checkbox hide';

    var updateTime = FormatDate.format('yyyy-MM-dd HH:mm', new Date(video.snippet.publishedAt).getTime());

    if (!isWatched) {
      className += ' unwatched';
    }

    var itemStyle = {
      // backgroundImage: 'url(' + video.snippet.thumbnails.medium.url + ')'
    };

    return (
      <li style={itemStyle} className={className}>
        <input className={checkboxClass} value={videoId} type="checkbox" />
        <div className="block" onClick={this.clickVideo.bind(this, videoId)}>
          <p className="video-title">{video.snippet.title.length > 56 ? video.snippet.title.substr(0, 56) + '...' : video.snippet.title}</p>
          <span className="update-date">{updateTime}</span>
        </div>
      </li>
    );
  }
});

module.exports = videoItem;
