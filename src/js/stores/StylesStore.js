var StylesConstants = require('../constants/StylesConstants');
var GridConstants = require('../constants/GridConstants');
var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';
var width = {};
var scroll = {};
var _data = {};
var rows = {};
var timers = {};
var topRow = {};


function removeRow(gridId, rowId) {
    delete rows[gridId][rowId];
}

function update(gridId, data) {
    _data[gridId] = data;
}

function togglePinColumn(gridId, fieldId) {
    StylesStore.getHeader(gridId).forEach(function (cell) {
        if (cell.fieldId == fieldId) {
            cell.isPin = !cell.isPin;
        }
    });
}

function setScroll(gridId, type, scrollSize) {
    scroll[gridId] = scroll[gridId] || {};
    if (scrollSize < 0)
        scrollSize = 0;
    scroll[gridId][type] = scrollSize;
}

function setRowCellHeight(gridId, rowId, fieldId, height) {
    var cell = {fieldId: fieldId, height: height};
    rows[gridId] = rows[gridId] || {};
    var grid = rows[gridId];

    grid[rowId] = grid[rowId] || [];
    var row = grid[rowId];
    var index = -1;
    for (var i = 0; i < row.length; i++) {
        if (row[i].fieldId == fieldId) {
            index = i;
            break;
        }
    }
    if (index == -1)
        row.push(cell);
    else
        row[index] = cell;

}

var StylesStore = assign({}, EventEmitter.prototype, {
    EVENTS: {
        SCROLL: 'SCROLL',
        V_SCROLL: 'V_SCROLL',
        CELL_UPDATE: 'CELL_UPDATE'
    },

    getTopRowHeight: function (gridId) {
        return topRow[gridId] || 0;
    },
    loaded: 50,
    getHeader: function (gridId) {
        var data = _data[gridId];
        return data ? data.header : [];
    },
    getRows: function (gridId) {
        var scrollSize = this.getScrollTop(gridId);
        var data = _data[gridId];
        var _rows = rows[gridId];
        if (_rows) {
            var totalHeight = 0;
            for (var i in _rows) {
                if (isNaN(i)) continue;
                totalHeight += this._getRowHeight(_rows[i]);
            }
            if (totalHeight - scrollSize < 800) {
                topRow[gridId] = scrollSize;
                if (data.rows.length > this.loaded)
                    this.loaded += 25
            }

        }


        var result = data ? data.rows.slice(0, this.loaded) : [];
        result.startIndex = this.loaded;
        return result;
    },

    getRowHeight: function (gridId, rowId) {
        var row = (rows[gridId] || {})[rowId];
        var max = -1;
        if (row) {
            row.forEach(function (cell) {
                if (cell.height > max) {
                    max = cell.height
                }
            });
        }
        return max == -1 ? null : max;
    },

    _getRowHeight: function (row) {
        var max = -1;
        row.forEach(function (cell) {
            if (cell.height > max) {
                max = cell.height
            }
        });
        return max;
    },

    getHolderWidth: function (gridId) {
        var fullW = this.getGridFullWidth(gridId);
        var barWidth = this.getScrollWidth(gridId);

        var p = barWidth / fullW;

        return p * barWidth;
    },
    getScrollTop: function (gridId) {
        var gridScroll = scroll[gridId];

        return gridScroll ? (gridScroll.top || 0) : 0;
    },
    getScrollLeft: function (gridId) {
        scroll[gridId] = scroll[gridId] || {};
        var holderWidth = this.getHolderWidth(gridId);
        var left = scroll[gridId].left || 0;
        var barWidth = this.getScrollWidth(gridId);
        if (left + holderWidth > barWidth) {
            left = barWidth - holderWidth;
        }

        return left;
    },
    getRealScrollLeft: function (gridId) {
        var relative = this.getScrollLeft(gridId);
        var holderWidth = this.getHolderWidth(gridId);
        var fullWidth = this.getGridFullWidth(gridId);
        var scrollBarWidth = this.getScrollWidth(gridId);

        var maxScroll = fullWidth - this.getGridWidth(gridId);

        // на сколько реально просколелно
        var fullScroll = (relative / (scrollBarWidth - holderWidth)) * maxScroll;
        var scrollByColumns = 0;
        var scrollableHeader = this.getHeader(gridId).filter(function (cell) {
            return !cell.isPin;
        });

        if (fullScroll == maxScroll)
            return maxScroll;

        for (var i = 0; i < scrollableHeader.length; i++) {
            if (scrollByColumns + scrollableHeader[i].width > fullScroll) {
                break;
            }
            scrollByColumns += scrollableHeader[i].width;
        }
        return scrollByColumns;
    },
    getGridClassName: function (gridId) {
        return StylesConstants.GRID_STYLE_PREFIX + gridId;
    },
    getColumnClassName: function (filedId) {
        return StylesConstants.COLUMN_STYLE_PREFIX + filedId;
    },
    getStyle: function (gridId, header) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);
        return header.map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ min-width: ' + cell.width + 'px; width: ' + cell.width + 'px;}';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    getPinStyle: function (gridId) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);

        return this.getPinnedColumns(gridId).map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ left:' + left + 'px; }';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    /** ширина видимой части таблицы */
    getGridWidth: function (gridId) {
        return (width[gridId] || 0) - 20;
    },

    /** ширина всей таблицы, включая невидимую часть */
    getGridFullWidth: function (gridId) {
        return this.getHeader(gridId).reduce(function (w, h2) {
            return w + h2.width;
        }, 0);

    },
    getGridHeight: function (gridId) {
        return 600;
    },
    getPinnedColumns: function (gridId) {
        var columns = this.getHeader(gridId);
        return columns.filter(function (cell) {
            return cell.isPin;
        });
    },


    getScrollWidth: function (gridId) {
        var pinnedWidth = this.getPinnedColumns(gridId)
            .reduce(function (w, c) {
                return w + c.width;
            }, 0);


        return this.getGridWidth(gridId) - pinnedWidth;
    },
    emitChange: function (gridId, event) {
        event = event || '';
        this.emit(CHANGE_EVENT + gridId + event);
    },
    /** если ожидается множество изменений за малый промежуток времени*/
    reduceEmitChange: function (gridId, event) {
        var key = gridId + event;
        if (timers[key] != null)
            clearTimeout(timers[key]);
        timers[key] = setTimeout(function () {
            StylesStore.emitChange(gridId, event);
        }, 15);
    },
    addChangeListeners: function (callback, gridId, event) {
        event = event || '';
        this.on(CHANGE_EVENT + gridId + event, callback);
    },
    removeChangeListener: function (callback, gridId, event) {
        event = event || '';
        this.removeListener(CHANGE_EVENT + gridId + event, callback);
    },

    dispatcherIndex: GridDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
            case StylesConstants.RESIZE:
                width[action.gridId] = action.width;
                StylesStore.emitChange(action.gridId);
                break;
            case StylesConstants.H_SCROLL:
                setScroll(action.gridId, 'left', action.scrollSize);
                StylesStore.emitChange(action.gridId, StylesStore.EVENTS.SCROLL);
                break;
            case StylesConstants.V_SCROLL:
                setScroll(action.gridId, 'top', action.scrollSize);
                StylesStore.emitChange(action.gridId, StylesStore.EVENTS.V_SCROLL);
                break;
            case StylesConstants.PIN_COLUMN:
                togglePinColumn(action.gridId, action.fieldId);
                StylesStore.emitChange(action.gridId);
                break;

            case GridConstants.UPDATE_DATA:
                update(action.gridId, {rows: action.rows, header: action.header});
                StylesStore.emitChange(action.gridId);
                break;

            case StylesConstants.UPDATE_ROW_HEIGHT:
                setRowCellHeight(action.gridId, action.rowId, action.fieldId, action.height);
                StylesStore.reduceEmitChange(action.gridId, StylesStore.EVENTS.CELL_UPDATE);
                break;

            case StylesConstants.REMOVE_ROW:
                removeRow(action.gridId, action.rowId);
                break;

        }
        return true;
    })
});

StylesStore.setMaxListeners(0);
module.exports = StylesStore;
