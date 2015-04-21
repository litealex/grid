var React = require('react');

var Header = React.createClass({
    render: function () {
       var header = this.props.header.map(function(cell){
            return (
                <div className="qtable__cell">{cell.label}</div>
            )
        });
        return (<div className="qtable__row--header">{header}</div>);
    }
});

module.exports = Header;