var GridDispatcher = require('../dispatcher/GridDispatcher');
var StylesConstants = require('../constants/StylesConstants');

var StylesActions = {
    resize: function (gridId, width) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.RESIZE,
            gridId: gridId,
            width: width
        });
    },
    hScroll: function (gridId, scrollSize) {
        GridDispatcher.handleViewAction({
            actionType: StylesConstants.H_SCROLL,
            gridId: gridId,
            scrollSize: scrollSize
        });
    }
};


module.exports = StylesActions;