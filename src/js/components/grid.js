var React = require('react'),
    Header = require('./header'),
    Body = require('./body'),
    StylesStore = require('../stores/StylesStore');

var Grid =
    React.createClass({
        statics: {
            id: 0,
            getNextId: function () {
                return ++this.id;
            }
        },
        gridId: null,
        componentWillMount: function () {
            this.gridId = Grid.getNextId();
        },
        render: function () {
            var gridClass = 'qtable ' + StylesStore.getGridClassName(this.gridId);
            return (
                <div className={gridClass}>
                    <Header gridId={this.gridId} header={this.props.header} />
                    <Body header={this.props.header} rows={this.props.rows}/>
                </div>)
        }
    });


module.exports = Grid;