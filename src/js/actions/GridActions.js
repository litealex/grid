var GridDispatcher = require('../dispatcher/GridDispatcher');
var GridConstants = require('../constants/GridConstants');

var GridActions = {
    update: function(fieldId){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.UPDATE_DATA,
            fieldId: fieldId
        });
    }
};


module.exports = GridActions;