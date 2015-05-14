var GridDispatcher = require('../dispatcher/GridDispatcher');
var StylesConstants = require('../constants/StylesConstants');

var StylesActions = {
    resize: function (gridId, width, height) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.RESIZE,
            gridId: gridId,
            height: height,
            width: width
        });
    },

    hScroll: function (gridId, scrollSize) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.H_SCROLL,
            gridId: gridId,
            scrollSize: scrollSize
        });
    },
    vScroll: function (gridId, scrollSize) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.V_SCROLL,
            gridId: gridId,
            scrollSize: scrollSize
        });
    },
    pinColumn: function (gridId, fieldId) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.PIN_COLUMN,
            gridId: gridId,
            fieldId: fieldId
        });
    },
    updateHeaderRowCellHeight: function (gridId, rowId, fieldId, height) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.UPDATE_ROW_HEIGHT,
            gridId: gridId,
            rowId: rowId,
            fieldId: fieldId,
            height: height,
            type: StylesConstants.ROW_TYPES.HEADER
        });
    },
    removeRow: function(gridId, rowId){
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.REMOVE_ROW,
            gridId: gridId,
            rowId: rowId
        });
    }
};


module.exports = StylesActions;