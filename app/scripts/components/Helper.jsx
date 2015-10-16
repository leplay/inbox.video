'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var Helper = React.createClass({
  clickLink: function() {
    var link = location.origin + '/faq.html';
    ActionCreator.openLink(link);
  },
  render() {
    return (
      <i onClick={this.clickLink} className="fa fa-question-circle help-icon hide"></i>
    );

  }
});

module.exports = Helper;
