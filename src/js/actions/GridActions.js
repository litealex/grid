var GridDispatcher = require('../dispatcher/GridDispatcher');
var GridConstants = require('../constants/GridConstants');

var GridActions = {
    update: function(gridId, header, rows){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.UPDATE_DATA,
            gridId: gridId,
            rows: rows,
            header: header
        });
    }
    ,resize: function(width){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.RESIZE,
            width:width
        });
    }
};


module.exports = GridActions;