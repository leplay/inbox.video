'use strict';

var React = require('react');

var Loading = React.createClass({
  render() {
    var {display} = this.props;
    var className = 'loading';

    if (!display) {
      className += ' hide';
    }

    return (
      <div className={className}>
        <i className="fa fa-spinner fa-pulse fa-5x"></i>
      </div>
    );

  }
});

module.exports = Loading;
