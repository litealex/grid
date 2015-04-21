var React = require('react'),
    StylesStore = require('../stores/StylesStore'),
    HeaderActions = require('../actions/HeaderActions'),
    HeaderStore = require('../stores/HeaderStore');

var Header = React.createClass({
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

    _onPin:function(fieldId){
        HeaderActions.pinColumn(fieldId);
    },

    render: function () {
        this.setStyle();
        var header = this.props.header.map(function (cell) {
            var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cell.fieldId);
            return (
                <div onClick={this._onPin.bind(this, cell.fieldId)} className={cellClass}>{cell.label}</div>
            )
        }.bind(this));
        return (<div className="qtable__row qtable__row--header">{header}</div>);
    }
});

module.exports = Header;