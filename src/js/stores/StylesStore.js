var StylesConstants = require('../constants/StylesConstants');
var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var GridStrore = require('./GridStore');


var CHANGE_EVENT = 'change';
var width = {};
var scroll = {};

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
        var gridWidth = this.getGridWidth(gridId);

        var p = gridWidth / fullW;

        return p * gridWidth;
    },
    getScrollLeft: function (gridId) {
        scroll[gridId] = scroll[gridId] || {};
        var holderWidth = this.getHolderWidth(gridId);
        var left = scroll[gridId].left || 0;
        if (left + holderWidth > width[gridId]) {
            left = width[gridId] - holderWidth;
        }

        return left;
    },

    getGridClassName: function (gridId) {
        return StylesConstants.GRID_STYLE_PREFIX + gridId;
    },
    getColumnClassName: function (filedId) {
        return StylesConstants.COLUMN_STYLE_PREFIX + filedId;
    },
    getStyle: function (gridId, metadata) {
        var gridClass = '.' + this.getGridClassName(gridId);
        return metadata.map(function (cell) {
            return gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ min-width: ' + cell.width + 'px; width: ' + cell.width + 'px;}';
        }.bind(this)).join('');
    },

    /** ширина видимой части таблицы */
    getGridWidth: function (gridId) {
        return width[gridId] || 0;
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

        }
        return true;
    })
});


module.exports = StylesStore;
