var React = require('react'),
    TopRow = require('./TopRow.react'),
    LastRow = require('./LastRow.react'),
    Row = require('./Row.react'),
    GridsStore = require('../stores/GridsStore'),
    StylesActions = require('../actions/StylesActions');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: GridsStore.getPinnedColumns(gridId),
        width: GridsStore.getGridWidth(gridId),
        height: GridsStore.getGridHeight(gridId),
        fullWidth: GridsStore.getGridFullWidth(gridId),
        rows: GridsStore.getRows(gridId),
        header: GridsStore.getHeader(gridId)
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

        GridsStore.addChangeListeners(this._onChange, this.props.gridId);
        GridsStore.addChangeListeners(this._onScroll, this.props.gridId, GridsStore.EVENTS.SCROLL);
        GridsStore.addChangeListeners(this._onVScroll, this.props.gridId, GridsStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        GridsStore.removeChangeListener(this._onChange, this.props.gridId);
        GridsStore.removeChangeListener(this._onScroll, this.props.gridId, GridsStore.EVENTS.SCROLL);
        GridsStore.removeChangeListener(this._onVScroll, this.props.gridId, GridsStore.EVENTS.V_SCROLL);
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
                width: this.state.fullWidth
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
        this.node.scrollLeft = GridsStore.getRealScrollLeft(this.props.gridId);
    },

    _onVScroll: function () {
        var rows = GridsStore.getRows(this.props.gridId);

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