var GridDispatcher = require('../dispatcher/GridDispatcher');
var StylesConstants = require('../constants/styles');

var StylesActions = {
    resize: function (gridId, width) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.RESIZE,
            gridId: gridId,
            width: width
        });
    },
    scroll: function (gridId, scroll) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.SCROLL,
            gridId: gridId,
            scroll: scroll
        });
    }
};


module.exports = StylesActions;