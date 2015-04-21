var stylesPrefix = require('../constants/styles');

module.exports = {
    getGridClassName: function (gridId) {
        return stylesPrefix.GRID_STYLE_PREFIX + gridId;
    },
    getColumnClassName: function (filedId) {
        return stylesPrefix.COLUMN_STYLE_PREFIX + filedId;
    },
    getStyle: function (gridId, metadata) {
        var gridClass = '.' + this.getGridClassName(gridId);
        return metadata.map(function (cell) {
            console.log(cell);
            return gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ width: ' + cell.width + 'px;}';
        }.bind(this)).join('');
    }
};
