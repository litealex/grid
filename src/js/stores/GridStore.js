'use strict';
var StylesConstants = require('../constants/StylesConstants'),
    GridConstants = require('../constants/GridConstants'),
    GridDispatcher = require('../dispatcher/GridDispatcher'),
    EventEmitter = require('events').EventEmitter,
    assign = require('object-assign');


var CHANGE_EVENT = 'change',
    _gridSize = {},
    scroll = {},
    _data = {},
    _rows = {},
    _timers = {};


function setGridSize(gridId, w, h) {
    _gridSize[gridId] = {width: w, height: h};
}

function removeRow(gridId, rowId) {
    delete _rows[gridId][rowId];
}

function update(gridId, data) {
    _data[gridId] = data;
}

function togglePinColumn(gridId, fieldId) {
    GridStore.getHeader(gridId).forEach(function (cell) {
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

function setRowCellHeight(gridId, rowId, fieldId, height, type) {
    var cell = {fieldId: fieldId, height: height};
    _rows[gridId] = _rows[gridId] || {};
    var grid = _rows[gridId];

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

    row.type = type

}

var GridStore = assign({}, EventEmitter.prototype, {
    EVENTS: {
        SCROLL: 'SCROLL',
        V_SCROLL: 'V_SCROLL',
        CELL_UPDATE: 'CELL_UPDATE'
    },

    getHeaderHeight: function (gridId) {
        var gridRows = _rows[gridId];

        if (gridRows) {
            return Object.keys(gridRows)
                .map(function (k) {
                    return gridRows[k]
                }).filter(function (r) {

                    return r.type == StylesConstants.ROW_TYPES.HEADER
                }).reduce(function (h, r) {
                    return h + this._getRowHeight(r);
                }.bind(this), 0);
        }
        return 0;
    },
    getTopRowHeight: function (gridId) {
        var rowH = this.getRowHeight(gridId);
        var scrollSize = this.getScrollTop(gridId);
        var si = (Math.floor(scrollSize / rowH) - 17);
        if (si < 0)
            si = 0;
        return si * rowH;
    },
    getLastRowHeight: function (gridId) {
        var rowH = this.getRowHeight(gridId);
        var data = _data[gridId];
        if (!data) return 0;
        var topRowH = this.getTopRowHeight(gridId);
        var fullH = data.rows.length * rowH;
        var res = fullH - topRowH - rowH * 17 * 3;
        if (res < 0)
            res = 0;
        return res;
    },

    getHeader: function (gridId) {
        var data = _data[gridId];
        return data ? data.header : [];
    },
    getRows: function (gridId) {
        var rowH = this.getRowHeight(gridId);
        var data = _data[gridId];
        var scrollSize = this.getScrollTop(gridId);

        var startIndex = Math.floor(scrollSize / rowH) - 17;
        if (startIndex < 0)
            startIndex = 0;
        if (data) {
            var lastRow = (data.rows.length - (startIndex + 17 * 3)) * rowH;
        }
        var result = data ? data.rows.slice(startIndex, startIndex + 60) : [];
        result.startIndex = startIndex;
        return result;

    },

    getRowHeight: function (gridId, rowId) {

        var gridRows = _rows[gridId];

        if (gridRows && gridRows[rowId])
            return this._getRowHeight(gridRows[rowId]);

        return 50;
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

        if (p >= 1)
            return -1;

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
    getStyle: function (gridId) {
        var gridClass = '.' + this.getGridClassName(gridId),
            header = this.getHeader(gridId),
            left = this.getRealScrollLeft(gridId);
        return header.map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ max-width: ' + cell.width + 'px; min-width: ' + cell.width + 'px; width: ' + cell.width + 'px; overflow: hidden;}';

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
        return (_gridSize[gridId] && _gridSize[gridId].width || 0);
    },

    /** ширина всей таблицы, включая невидимую часть */
    getGridFullWidth: function (gridId) {
        return this.getHeader(gridId).reduce(function (w, h2) {
            return w + h2.width;
        }, 0);

    },
    /** высота контейнера строк */
    getGridHeight: function (gridId) {
        var headerHeight = this.getHeaderHeight(gridId);
        // 20 -  высота нижнего скроллбара
        return _gridSize[gridId] && (_gridSize[gridId].height - headerHeight - 20) || 0;
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
        if (_timers[key] != null)
            clearTimeout(_timers[key]);
        _timers[key] = setTimeout(function () {
            GridStore.emitChange(gridId, event);
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
                setGridSize(action.gridId, action.width, action.height);
                GridStore.emitChange(action.gridId);
                break;
            case StylesConstants.H_SCROLL:
                setScroll(action.gridId, 'left', action.scrollSize);
                GridStore.emitChange(action.gridId, GridStore.EVENTS.SCROLL);
                break;
            case StylesConstants.V_SCROLL:
                setScroll(action.gridId, 'top', action.scrollSize);
                GridStore.emitChange(action.gridId, GridStore.EVENTS.V_SCROLL);
                break;
            case StylesConstants.PIN_COLUMN:
                togglePinColumn(action.gridId, action.fieldId);
                GridStore.emitChange(action.gridId);
                break;

            case GridConstants.UPDATE_DATA:
                update(action.gridId, {rows: action.rows, header: action.header});
                GridStore.emitChange(action.gridId);
                break;

            case StylesConstants.UPDATE_ROW_HEIGHT:
                setRowCellHeight(action.gridId, action.rowId, action.fieldId, action.height, action.type);
                GridStore.reduceEmitChange(action.gridId, GridStore.EVENTS.CELL_UPDATE);
                break;

            case StylesConstants.REMOVE_ROW:
                removeRow(action.gridId, action.rowId);
                break;

        }
        return true;
    })
});

GridStore.setMaxListeners(0);
module.exports = GridStore;
