var React = require('react'),
    StylesStore = require('../stores/StylesStore');

var Header = React.createClass({
    style: null,
    setStyle: function () {
        if (this.style == null) {
            this.style = document.createElement('style');
            document.head.appendChild(this.style);
        }
        this.style.innerText = StylesStore.getStyle(this.props.gridId, this.props.header);
    },
    render: function () {
        this.setStyle();
        var header = this.props.header.map(function (cell) {
            var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cell.fieldId);
            return (
                <div className={cellClass}>{cell.label}</div>
            )
        });
        return (<div className="qtable__row--header">{header}</div>);
    }
});

module.exports = Header;