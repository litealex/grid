var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var GridConstants = require('../constants/GridConstants');
var assign = require('object-assign');

var _header = [];
var _rows = [];

var CHANGE_EVENT = 'change';


function update(data) {
    console.log(data);
    _header = data.header;
    _rows = data.rows;
}

var GridStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListeners: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: GridDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
            case GridConstants.UPDATE_DATA:
                update({rows: action.rows, header: action.header});
                GridStore.emitChange();
                break;
        }
        return true;
    })
});


module.exports = GridStore;