var React = require('react'),
    Header = require('./header');

var Body = React.createClass({

    render: function () {
        console.log(this.props.rows);
        var rows = this.props.rows.map(function(){
            return (<Header header={this.props.header} />)
        }.bind(this));

        return (<div>{rows}</div>);
    }
});

module.exports = Body;