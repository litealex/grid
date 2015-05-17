var React = require('react'),
    $ = require('jquery'),
    GridStore = require('../stores/GridStore'),
    HeaderCell = require('./HeaderCell.react'),
    assign = require('object-assign');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: GridStore.getPinnedColumns(gridId),
        width: GridStore.getGridWidth(gridId),
        fullWidth: GridStore.getGridFullWidth(gridId),
        header: GridStore.getHeader(gridId)
    };
}


var Header = React.createClass({
    mixins: [require('../mixins/Header.mixin')],

    getInitialState: function () {
        return assign(getStateFromStore(), {rowHeight: 18});
    },

    componentDidMount: function () {
        this.node = this.getDOMNode();
      },

    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    render: function () {
        var headerStyle = {
            width: this.state.width
        };

        var rowStyle = {
            width: this.state.fullWidth,
            height: this.state.rowHeight,
            paddingLeft: this.state.pinnedColumns.reduce(function (w, c) {
                return w + c.width;
            }, 0)
        };

        var header = this.state.header.map(function (cell) {
            var options = {
                isPinned: this.state.pinnedColumns.indexOf(cell) != -1,
                left: this.node.scrollLeft
            };

            return (
                <HeaderCell rowId={this.rowId} options={options} gridId={this.props.gridId} cell={cell} />
            );
        }.bind(this));
        return (
            <div style={headerStyle} className="qtable__header">
                <div style={rowStyle} className="qtable__row qtable__row--header">{header}</div>
            </div>);
    },
    rowId: "headerRow",
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
        this.setPinStyle();
    },
    node: null
});

module.exports = Header;