var React = require('react'),
    StylesStore = require('../stores/StylesStore');
var Row = React.createClass({
    render: function () {
        var cells = this.props.metadata.map(function (cellMeta) {
            var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cellMeta.fieldId);
            return <div className={cellClass}>{this.props.cells[cellMeta.fieldId]}</div>
        }.bind(this));
        return (<div className="qtable__row">{cells}</div>);
    }
});

module.exports = Row;