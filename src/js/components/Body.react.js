var React = require('react'),
    TopRow = require('./toprow'),
    LastRow = require('./lastrow'),
    Row = require('./Row.react'),
    StylesStore = require('../stores/StylesStore'),
    GridStore = require('../stores/GridStore'),
    StylesActions = require('../actions/StylesActions');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: StylesStore.getPinnedColumns(gridId),
        width: StylesStore.getGridWidth(gridId),
        height: StylesStore.getGridHeight(gridId),
        fullWidth: StylesStore.getGridFullWidth(gridId)
    };
}


var Body = React.createClass({
    getInitialState: function () {
        return getStateFromStore();
    },
    componentDidMount: function () {
        this.node = this.getDOMNode();
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },
    render: function () {
        var renderRows = null,
            rows,
            style = {
                width: this.state.width,
                height: this.state.height

            },
            paddingLeft = this.state.pinnedColumns.reduce(function (w, c) {
                return w + c.width;
            }, 0);

        if (this.props.rows.length > 100) {
            renderRows = this.props.rows.slice(0, 50);
        } else {
            renderRows = this.props.rows;
        }

        rows = renderRows.map(function (row) {
            var options = {paddingLeft:paddingLeft, width: this.state.fullWidth};
            return (<Row options={options} gridId={this.props.gridId} metadata={this.props.header} cells={row} />)
        }.bind(this));


        return (
            <div style={style} className="qtable__body">
                <TopRow></TopRow>
            {rows}
                <LastRow></LastRow>
            </div>);
    },
    node: null,
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },
    _onScroll: function () {
        this.node.scrollLeft = StylesStore.getRealScrollLeft(this.props.gridId);
    }

});

module.exports = Body;