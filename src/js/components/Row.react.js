var React = require('react'),
    assign = require('object-assign'),
    Cell = require('./Cell.react'),
    StylesActions = require('../actions/StylesActions'),
    GridsStore = require('../stores/GridsStore');


function getStateFromStore(gridId, rowId) {
    return {
        pinnedColumns: GridsStore.getPinnedColumns(gridId),
        rowHeight: GridsStore.getRowHeight(gridId, rowId)
    }
}

var Row = React.createClass({
    statics: {
        id: 0,
        getNextId: function () {
            return ++this.id;
        }
    },
    componentWillMount: function () {
        this.rowId = Row.getNextId();
    },
    getInitialState: function () {
        return getStateFromStore(this.props.gridId, this.rowId);
    },
    componentDidMount: function () {

        GridsStore.addChangeListeners(this._onChange, this.props.gridId);
    },
    componentWillUnmount: function () {
        GridsStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesActions.removeRow(this.props.gridId, this.rowId);
    },


    render: function () {
        var style = assign({}, this.props.options, {height: this.state.rowHeight}),
            options = {pinnedColumns: this.state.pinnedColumns, rowHeight: this.state.rowHeight},
            cells = this.props.metadata.map(function (cellMeta) {
            return <Cell gridId={this.props.gridId} rowId={this.rowId} options={options} cellMeta={cellMeta} cell={this.props.cells[cellMeta.fieldId]} />;
        }.bind(this));


        return (<div style={style} className="qtable__row">{cells}</div>);
    },
    rowId: null,
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId, this.rowId));
    }

});

module.exports = Row;