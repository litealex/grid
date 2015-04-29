var StylesConstants = require('../constants/styles');
var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';
var width = {};
var scroll = {};

var StylesStore = assign({}, EventEmitter.prototype, {
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

    getGridWidth: function (gridId) {
        return width[gridId] || 0;
    },
    getGridHeight: function (gridId) {
        return 600;
    },

    getScrollLeft: function (gridId) {
        scroll[gridId] = scroll[gridId] || {};
        return scroll[gridId].left || 0;
    },

    emitChange: function (gridId) {
        this.emit(CHANGE_EVENT + gridId);
    },
    addChangeListeners: function (callback, gridId) {
        this.on(CHANGE_EVENT + gridId, callback);
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
            case StylesConstants.SCROLL:
                scroll[action.gridId] = action.scroll;
                StylesStore.emitChange(action.gridId);
                break;

        }
        return true;
    })
});


module.exports = StylesStore;
