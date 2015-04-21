var GridDispatcher = require('../dispatcher/GridDispatcher');
var GridConstants = require('../constants/GridConstants');

var HeaderActions = {
    pinColumn: function(fieldId){
        GridDispatcher.handleViewAction({
            actionType: GridConstants.PIN_COLUMN,
            fieldId: fieldId
        });
    }
};


module.exports = HeaderActions;