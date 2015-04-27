var React = require('react'),
    Row = require('./row');

var Body = React.createClass({
    getInitialState: function () {
        return {
            width: 850
        };
    },
    componentWillMount: function () {
        window.addEventListener('resize', this.setWidth);
    },
    setWidth: function () {
        this.setState({width: window.innerWidth});
    },
    render: function () {
        var renderRows = null;
        if (this.props.rows.length > 100) {
            renderRows = this.props.rows.slice(0, 100);
        } else {
            renderRows = this.props.rows;
        }
        var rows = renderRows.map(function (row) {
            return (<Row metadata={this.props.header} cells={row} />)
        }.bind(this));
        return (<div className="qtable__body">{rows}</div>);
    }
});

module.exports = Body;