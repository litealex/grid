var React = require('react'),
    TopRow = require('./TopRow.react'),
    LastRow = require('./LastRow.react'),
    Row = require('./Row.react'),
    GridStore = require('../stores/GridStore'),
    StylesActions = require('../actions/StylesActions');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: GridStore.getPinnedColumns(gridId),
        width: GridStore.getGridWidth(gridId),
        height: GridStore.getGridHeight(gridId),
        rowHeight: GridStore.getRowHeight(gridId),
        fullWidth: GridStore.getGridFullWidth(gridId),
        rows: GridStore.getRows(gridId),
        header: GridStore.getHeader(gridId)
    };
}


var Body = React.createClass({
    getInitialState: function () {
        return getStateFromStore();
    },
    componentDidMount: function () {
        this.node = this.getDOMNode();
        this.node.scrollTop = 0;
        this.node.addEventListener('scroll', this._scrollHandler);

        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        GridStore.addChangeListeners(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.addChangeListeners(this._onVScroll, this.props.gridId, GridStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        GridStore.removeChangeListener(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.removeChangeListener(this._onVScroll, this.props.gridId, GridStore.EVENTS.V_SCROLL);
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

        renderRows = this.state.rows;


        rows = renderRows.map(function (row) {
            var options = {
                paddingLeft: paddingLeft,
                width: this.state.fullWidth,
                height: this.state.rowHeight
            };
            return (<Row options={options} gridId={this.props.gridId} metadata={this.state.header} cells={row} />)
        }.bind(this));

        return (
            <div style={style} className="qtable__body">
                <TopRow gridId={this.props.gridId}/>
            {rows}
                <LastRow gridId={this.props.gridId}/>
            </div>);
    },
    node: null,

    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },
    _onScroll: function () {
        this.node.scrollLeft = GridStore.getRealScrollLeft(this.props.gridId);
    },

    _onVScroll: function () {
        var rows = GridStore.getRows(this.props.gridId);

        if (this.state.startIndex != rows.startIndex) {
            this.setState({
                startIndex: rows.startIndex,
                rows: rows
            });
        }

    },
    _scrollHandler: function (e) {

        StylesActions.vScroll(this.props.gridId, e.target.scrollTop);
    }
});

module.exports = Body;