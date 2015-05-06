var React = require('react');

var LastRow = React.createClass({
    render: function () {
        var style = {height: 900 * 20};
        return (<div style={style} className="qtable__row qtable__row--last"></div>);
    }
});

module.exports = LastRow;