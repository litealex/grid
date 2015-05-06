var StylesConstants = require('../constants/StylesConstants');
var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var GridStrore = require('./GridStore');


var CHANGE_EVENT = 'change';
var width = {};
var scroll = {};

function togglePinColumn(gridId, fieldId) {
    GridStrore.getHeader(gridId).forEach(function (cell) {
        if (cell.fieldId == fieldId) {
            cell.isPin = !cell.isPin;
        }
    });
}

function setScroll(gridId, type, scrollSize) {
    scroll[gridId] = scroll[gridId] || {};
    if (scrollSize < 0)
        scrollSize = 0;
    scroll[gridId][type] = scrollSize;
}


var StylesStore = assign({}, EventEmitter.prototype, {
    EVENTS: {
        SCROLL: 'SCROLL'
    },

    getHolderWidth: function (gridId) {
        var fullW = this.getGridFullWidth(gridId);
        var barWidth = this.getScrollWidth(gridId);

        var p = barWidth / fullW;

        return p * barWidth;
    },
    getScrollLeft: function (gridId) {
        scroll[gridId] = scroll[gridId] || {};
        var holderWidth = this.getHolderWidth(gridId);
        var left = scroll[gridId].left || 0;
        var barWidth = this.getScrollWidth(gridId);
        if (left + holderWidth > barWidth) {
            left = barWidth - holderWidth;
        }

        return left;
    },
    getRealScrollLeft: function (gridId) {
        var relative = this.getScrollLeft(gridId);
        var holderWidth = this.getHolderWidth(gridId);
        var fullWidth = this.getGridFullWidth(gridId);
        var scrollBarWidth = this.getScrollWidth(gridId);

        var maxScroll = fullWidth - this.getGridWidth(gridId);

        // на сколько реально просколелно
        var fullScroll = (relative / (scrollBarWidth - holderWidth)) * maxScroll;
        var scrollByColumns = 0;
        var scrollableHeader = GridStrore.getHeader(gridId).filter(function (cell) {
            return !cell.isPin;
        });

        if (fullScroll == maxScroll)
            return maxScroll;

        for (var i = 0; i < scrollableHeader.length; i++) {
            if (scrollByColumns + scrollableHeader[i].width > fullScroll) {
                break;
            }
            scrollByColumns += scrollableHeader[i].width;
        }

        console.log(scrollByColumns);
        return scrollByColumns;

    },
    getGridClassName: function (gridId) {
        return StylesConstants.GRID_STYLE_PREFIX + gridId;
    },
    getColumnClassName: function (filedId) {
        return StylesConstants.COLUMN_STYLE_PREFIX + filedId;
    },
    getStyle: function (gridId, header) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);
        return header.map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ min-width: ' + cell.width + 'px; width: ' + cell.width + 'px;}';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    getPinStyle: function (gridId) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);

        return this.getPinnedColumns(gridId).map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ left:' + left + 'px; }';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    /** ширина видимой части таблицы */
    getGridWidth: function (gridId) {
        return (width[gridId] || 0) - 20;
    },

    /** ширина всей таблицы, включая невидимую часть */
    getGridFullWidth: function (gridId) {
        return GridStrore.getHeader(gridId).reduce(function (w, h2) {
            return w + h2.width;
        }, 0);

    },
    getGridHeight: function (gridId) {
        return 600;
    },
    getPinnedColumns: function (gridId) {
        var columns = GridStrore.getHeader(gridId);
        return columns.filter(function (cell) {
            return cell.isPin;
        });
    },


    getScrollWidth: function (gridId) {
        var pinnedWidth = this.getPinnedColumns(gridId)
            .reduce(function (w, c) {
                return w + c.width;
            }, 0);


        return this.getGridWidth(gridId) - pinnedWidth;
    },
    emitChange: function (gridId, event) {
        event = event || '';
        this.emit(CHANGE_EVENT + gridId + event);
    },
    addChangeListeners: function (callback, gridId, event) {
        event = event || '';
        this.on(CHANGE_EVENT + gridId + event, callback);
    },
    removeChangeListener: function (callback, gridId) {
        this.removeListener(CHANGE_EVENT + gridId, callback);
    },
    dispatcherIndex: GridDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
            case StylesConstants.RESIZE:
                width[action.gridId] = action.width;
                StylesStore.emitChange(action.gridId);
                break;
            case StylesConstants.H_SCROLL:
                setScroll(action.gridId, 'left', action.scrollSize);
                StylesStore.emitChange(action.gridId, StylesStore.EVENTS.SCROLL);
                break;
            case StylesConstants.PIN_COLUMN:
                togglePinColumn(action.gridId, action.fieldId);
                StylesStore.emitChange(action.gridId);
                break;

        }
        return true;
    })
});

StylesStore.setMaxListeners(0);
module.exports = StylesStore;
