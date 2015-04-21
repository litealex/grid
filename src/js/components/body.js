var React = require('react'),
    Row = require('./row');

var Body = React.createClass({
    render: function () {
        var rows = this.props.rows.map(function(row){
            return (<Row metadata={this.props.header} cells={row} />)
        }.bind(this));
        return (<div>{rows}</div>);
    }
});

module.exports = Body;