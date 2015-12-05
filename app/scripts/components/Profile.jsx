'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');
var Constants = require('../constants/AppConstants');

var Profile = React.createClass({
  close: function() {
    ActionCreator.showProfile(false);
  },
  render() {
    var {user} = this.props;

    return (
      <div className="channel-center profile">
        <div className="profile-info">
          <img src={user.$avatar} alt="" />
          <h3>{user.$name}</h3>
          <p>Joined {user.$created}</p>
        </div>
        <span className="close" onClick={this.close}>&times;</span>
      </div>
    );

  }
});

module.exports = Profile;
