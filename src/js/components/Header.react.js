var React = require('react'),
    $ = require('jquery'),
    StylesActions = require('../actions/StylesActions'),
    HeaderActions = require('../actions/HeaderActions'),
    GridStore = require('../stores/GridStore'),
    StylesStore = require('../stores/StylesStore'),
    HeaderCell = require('./HeaderCell.react');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: StylesStore.getPinnedColumns(gridId),
        width: StylesStore.getGridWidth(gridId),
        fullWidth: StylesStore.getGridFullWidth(gridId)
    }
}

var Header = React.createClass({
    getInitialState: function () {
        return getStateFromStore();
    },


    node: null,
    componentDidMount: function () {

        this.node = this.getDOMNode();
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        GridStore.addChangeListeners(this._onScroll, this.props.gridId);
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onScroll, this.props.gridId);
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
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
            paddingLeft: this.state.pinnedColumns.reduce(function (w, c) {
                return w + c.width;
            }, 0)
        };

        this.setStyle();
        var header = this.props.header.map(function (cell) {
            var options = {
                isPinned: this.state.pinnedColumns.indexOf(cell) != -1,
                left: this.node.scrollLeft
            };

            return (
                <HeaderCell options={options} gridId={this.props.gridId} cell={cell} />
            );
        }.bind(this));
        return (
            <div style={headerStyle} className="qtable__header">
                <div style={rowStyle} className="qtable__row qtable__row--header">{header}</div>
            </div>);
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },

    style: null,
    setStyle: function () {
        if (this.style == null) {
            this.style = document.createElement('style');
            document.head.appendChild(this.style);
        }
        var style = StylesStore.getStyle(this.props.gridId, this.props.header);
        if (this.style.textContent !== undefined) {
            this.style.textContent = style;
        } else {
            this.style.innerText = style;
        }
    },

    prevStyle: null,
    pinStyle: null,
    pervScrollSize: 0,
    setPinStyle: function () {
        if (this.pinStyle == null) {
            this.pinStyle = document.createElement('style');
            document.head.appendChild(this.pinStyle);
        }
        var style = StylesStore.getPinStyle(this.props.gridId, this.props.header);

        if (style == this.prevStyle) {
            return;
        }

        this.prevStyle = style;

        if (this.pinStyle.textContent !== undefined) {
            this.pinStyle.textContent = style;
        } else {
            this.pinStyle.innerText = style;
        }
    },
    _onScroll: function () {
        this.setPinStyle();
        this.node.scrollLeft = StylesStore.getRealScrollLeft(this.props.gridId);
    }
});

module.exports = Header;