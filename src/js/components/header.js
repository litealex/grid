var React = require('react'),
    $ = require('jquery'),
    StylesStore = require('../stores/StylesStore'),
    HeaderActions = require('../actions/HeaderActions'),
    HeaderStore = require('../stores/HeaderStore'),
    StylesStore = require('../stores/StylesStore');

function getStateFromStore(gridId) {
    return {
        width: StylesStore.getGridWidth(gridId),
        scrollLeft: StylesStore.getScrollLeft(gridId)
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

    componentDidMount: function () {
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
    },

    getInitialState: function () {
        return {
            style: {}
        };
    },
    render: function () {
        var headerStyle = {
            width: this.state.width
        };
        var rowStyle = {
            marginLeft: -this.state.scrollLeft
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
    }
});

module.exports = Header;