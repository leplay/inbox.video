'use strict';

var React = require('react');
var ActionCreator = require('../actions/HeisenbergActionCreators');

var Helper = React.createClass({
  clickLink: function() {
    var link = 'http://yinshi.co/faq.html';
    ActionCreator.openLink(link);
  },
  render() {
    return (
      <i onClick={this.clickLink} className="fa fa-question-circle help-icon"></i>
    );

  }
});

module.exports = Helper;
