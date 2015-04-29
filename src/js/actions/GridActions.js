var GridDispatcher = require('../dispatcher/GridDispatcher');
var GridConstants = require('../constants/GridConstants');

var GridActions = {
    update: function(fieldId){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.UPDATE_DATA,
            fieldId: fieldId
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