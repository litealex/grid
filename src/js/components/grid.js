var React = require('react'),
    Header = require('./header'),
    Body = require('./body');

var Grid =
    React.createClass({
        render: function () {

            return (
                <div className="qtable">
                    <Header header={this.props.header} />
                    <Body header={this.props.header} rows={this.props.rows}/>
                </div>)
        }
    });


module.exports = Grid;