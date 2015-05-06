var React = require('react'),
    StylesStore = require('../stores/StylesStore'),
    GridStore = require('../stores/GridStore');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: StylesStore.getPinnedColumns(gridId)
    }
}

var Row = React.createClass({
    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    componentDidMount: function () {

        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        //StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        //StylesStore.removeChangeListener(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },


    render: function () {
        var pinnedColumns = this.state.pinnedColumns;

        var cells = this.props.metadata.map(function (cellMeta) {
            var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cellMeta.fieldId);
            if (pinnedColumns.indexOf(cellMeta) != -1) {
                cellClass += ' qtable__cell--pin';
            }

            return <div className={cellClass}>{this.props.cells[cellMeta.fieldId]}</div>
        }.bind(this));
        return (<div style={this.props.options} className="qtable__row">{cells}</div>);
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    }
});

module.exports = Row;