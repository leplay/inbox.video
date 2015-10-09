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
    var isSelected = selectedVideoId === video.id;
    var className = isSelected ? 'video selected' : 'video';
    var checkboxClass = selectMode ? 'checkbox' : 'checkbox hide';

    var updateTime = FormatDate.format('yyyy-MM-dd HH:mm', new Date(video.snippet.publishedAt).getTime());

    if (!isWatched) {
      className += ' unwatched';
    }

    return (
      <li className={className}>
        <input className={checkboxClass} value={video.id} type="checkbox" />
        <div className="block" onClick={this.clickVideo.bind(this, video.contentDetails.videoId)}>
          <p className="video-title">{video.snippet.title}</p>
          <span className="update-date">{updateTime}</span>
        </div>
      </li>
    );
  }
});

module.exports = videoItem;
