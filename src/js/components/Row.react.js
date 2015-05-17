var React = require('react'),
    Cell = require('./Cell.react'),
    StylesActions = require('../actions/StylesActions'),
    GridStore = require('../stores/GridStore');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: GridStore.getPinnedColumns(gridId)
    }
}

var Row = React.createClass({
    statics: {
        id: 0,
        getNextId: function () {
            return ++this.id;
        }
    },
    componentWillMount: function(){
        this.rowId = Row.getNextId();
    },
    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    componentDidMount: function () {
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesActions.removeRow(this.props.gridId, this.rowId);
    },


    render: function () {
        var options = {
            pinnedColumns: this.state.pinnedColumns,
            rowHeight: this.props.options.height
        };

        var cells = this.props.metadata.map(function (cellMeta) {
            return <Cell gridId={this.props.gridId} rowId={this.rowId} options={options} cellMeta={cellMeta} cell={this.props.cells[cellMeta.fieldId]} />;
        }.bind(this));


        return (<div style={this.props.options} className="qtable__row">{cells}</div>);
    },
    rowId: null,
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },

});

module.exports = Row;