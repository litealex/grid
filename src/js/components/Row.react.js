var React = require('react'),
    Cell = require('./Cell.react'),
    StylesStore = require('../stores/StylesStore');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: StylesStore.getPinnedColumns(gridId)
    }
}

var Row = React.createClass({
    statics: {
        id: 0,
        getNextId: function () {
            return ++this.id;
        }
    },
    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    componentDidMount: function () {
        this.rowId = Row.getNextId();
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onCellUpdate, this.props.gridId, StylesStore.EVENTS.CELL_UPDATE);
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        //todo: remove this.rowId from StylesStrore
    },


    render: function () {
        var options = {pinnedColumns: this.state.pinnedColumns};
        this.props.width = this.state.rowHeight;



        var cells = this.props.metadata.map(function (cellMeta) {
            return <Cell gridId={this.props.gridId} rowId={this.rowId} options={options} cellMeta={cellMeta} cell={this.props.cells[cellMeta.fieldId]} />;
        }.bind(this));


        return (<div style={this.props.options} className="qtable__row">{cells}</div>);
    },
    rowId: null,
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },
    _onCellUpdate: function () {
        var newRowHeight = StylesStore.getRowHeight(this.props.gridId, this.rowId);

        if (this.state.rowHeight != newRowHeight) {
            this.setState({
                rowHeight: newRowHeight
            });
        }
    }
});

module.exports = Row;