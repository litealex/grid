var React = require('react'),
    TopRow = require('./TopRow.react'),
    LastRow = require('./LastRow.react'),
    Row = require('./Row.react'),
    StylesStore = require('../stores/StylesStore'),
    StylesActions = require('../actions/StylesActions');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: StylesStore.getPinnedColumns(gridId),
        width: StylesStore.getGridWidth(gridId),
        height: StylesStore.getGridHeight(gridId),
        rowHeight: StylesStore.getRowHeight(gridId),
        fullWidth: StylesStore.getGridFullWidth(gridId),
        rows: StylesStore.getRows(gridId),
        header: StylesStore.getHeader(gridId)
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

        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
        StylesStore.addChangeListeners(this._onVScroll, this.props.gridId, StylesStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
        StylesStore.removeChangeListener(this._onVScroll, this.props.gridId, StylesStore.EVENTS.V_SCROLL);
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
        this.node.scrollLeft = StylesStore.getRealScrollLeft(this.props.gridId);
    },

    _onVScroll: function () {
        var rows = StylesStore.getRows(this.props.gridId);

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