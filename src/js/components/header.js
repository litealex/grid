var React = require('react'),
    $ = require('jquery'),
    StylesStore = require('../stores/StylesStore'),
    HeaderActions = require('../actions/HeaderActions'),
    GridStore = require('../stores/GridStore'),
    StylesStore = require('../stores/StylesStore');


function getStateFromStore(gridId) {
    return {
        width: StylesStore.getGridWidth(gridId),
        fullWidth: StylesStore.getGridFullWidth(gridId)
    }
}

var Header = React.createClass({
    getInitialState: function () {
        return getStateFromStore();
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

    _onPin: function (fieldId) {
        HeaderActions.pinColumn(fieldId);
    },
    node: null,
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

    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    render: function () {
        var headerStyle = {
            width: this.state.width
        };

        var rowStyle = {
            width: this.state.fullWidth
        };

        this.setStyle();
        var header = this.props.header.map(function (cell) {
            var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cell.fieldId);
            return (
                <div onClick={this._onPin.bind(this, cell.fieldId)} className={cellClass}>{cell.label}</div>
            )
        }.bind(this));
        return (
            <div style={headerStyle} className="qtable__header">
                <div style={rowStyle} className="qtable__row qtable__row--header">{header}</div>
            </div>);
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },
    _onScroll: function () {
        this.node.scrollLeft = StylesStore.getRealScrollLeft(this.props.gridId);
    }
});

module.exports = Header;