var GridDispatcher = require('../dispatcher/GridDispatcher'),
    GridConstants = require('../constants/GridConstants');

var StylesActions = {
    resize: function (gridId, width) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.RESIZE,
            gridId: gridId,
            width: width
        });
    },

    hScroll: function (gridId, scrollSize) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.H_SCROLL,
            gridId: gridId,
            scrollSize: scrollSize
        });
    },
    vScroll: function (gridId, scrollSize) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.V_SCROLL,
            gridId: gridId,
            scrollSize: scrollSize
        });
    },
    pinColumn: function (gridId, fieldId) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.PIN_COLUMN,
            gridId: gridId,
            fieldId: fieldId
        });
    },
    updateHeaderRowHeight: function (gridId, rowId, fieldId, height) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.UPDATE_HEADER_ROW_HEIGHT,
            gridId: gridId,
            rowId: rowId,
            fieldId: fieldId,
            height: height
        });
    },
    removeRow: function(gridId, rowId){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.REMOVE_ROW,
            gridId: gridId,
            rowId: rowId
        });
    }
};


module.exports = StylesActions;