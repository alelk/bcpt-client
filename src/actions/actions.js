/**
 * Actions
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import {tableItemsChecked, isPageFetched, tableItemFromResponse} from '../reducers/reducers'
import {sortedAsParams, filteredAsParams} from '../api/bcptRestApi'
import {getTableRowByLocalIdOrExternalId} from './utils'
import {CALL_BCPT_REST_API} from '../middleware/bcptRestApiMiddleware'

export const ACTION_TABLE_DATA_REQUEST = 'ACTION_TABLE_DATA_REQUEST';
export const ACTION_TABLE_DATA_SUCCESS = 'ACTION_TABLE_DATA_SUCCESS';
export const ACTION_TABLE_DATA_FAILURE = 'ACTION_TABLE_DATA_FAILURE';

const fetchTableDataWithApi = (tableName, pageNumber, itemsPerPage, sorted, filtered) => ({
    [CALL_BCPT_REST_API] : {
        types : [ACTION_TABLE_DATA_REQUEST, ACTION_TABLE_DATA_SUCCESS, ACTION_TABLE_DATA_FAILURE],
        method : 'fetchTableData',
        tableName,
        pageNumber,
        itemsPerPage,
        sorted,
        filtered
    }
});

const isEqualTableParams = (existingTable, newTable) => {
    return existingTable && newTable && existingTable.itemsPerPage === newTable.itemsPerPage
        && sortedAsParams(existingTable.sorted) === sortedAsParams(newTable.sorted)
        && filteredAsParams(existingTable.filtered) === filteredAsParams(newTable.filtered)
};

export const fetchTableData = (tableName, pageNumber, itemsPerPage, sorted, filtered) => (dispatch, getState) => {
    if (!isEqualTableParams(getState().tables[tableName], {pageNumber, itemsPerPage, sorted, filtered}))
        dispatch(invalidateTablePages(tableName));
    dispatch(modifyTableInfo(tableName, {pageNumber, itemsPerPage, sorted, filtered}));
    if (!isPageFetched(getState().tablePages, tableName, pageNumber)) {
        dispatch(fetchTableDataWithApi(tableName, pageNumber || 1, itemsPerPage || 15, sorted, filtered));
    }
    if (pageNumber && !isPageFetched(getState().tablePages, tableName, pageNumber + 1)) {
        dispatch(fetchTableDataWithApi(tableName, pageNumber + 1 || 1, itemsPerPage || 15, sorted, filtered));
    }
};

export const ACTION_TABLE_INVALIDATE_PAGES = 'ACTION_TABLE_INVALIDATE_PAGES';

export const invalidateTablePages = (tableName) => ({
    type: ACTION_TABLE_INVALIDATE_PAGES,
    tableName
});

export const ACTION_TABLE_CHECK_ROW = 'ACTION_TABLE_CHECK_ROW';

export const checkTableRow = (tableName, localId, changes) => (dispatch, getState) => {
    dispatch({
        type : ACTION_TABLE_CHECK_ROW,
        tableName,
        localId,
        changes
    });
    return dispatch(
        modifyTableInfo(tableName, {checkedItems: tableItemsChecked(getState().tableItems, tableName)})
    );
};

export const ACTION_TABLE_MODIFY_INFO = 'ACTION_TABLE_MODIFY_INFO';

export const modifyTableInfo = (tableName, changes) => ({
    type : ACTION_TABLE_MODIFY_INFO,
    tableName,
    changes
});

export const ACTION_TABLE_DELETE_ROW = 'ACTION_TABLE_DELETE_ROW';

export const deleteTableRow = (tableName, localId) => ({
    type : ACTION_TABLE_DELETE_ROW,
    tableName,
    localId
});

export const ACTION_TABLE_EDIT_ROW = 'ACTION_TABLE_EDIT_ROW';

export const editTableRow = (tableName, localId) => ({
    type : ACTION_TABLE_EDIT_ROW,
    tableName,
    localId
});

export const ACTION_TABLE_ROW_REQUEST = 'ACTION_TABLE_ROW_REQUEST';
export const ACTION_TABLE_ROW_SUCCESS = 'ACTION_TABLE_ROW_SUCCESS';
export const ACTION_TABLE_ROW_FAILURE = 'ACTION_TABLE_ROW_FAILURE';

const fetchTableRowWithApi = (types, tableName, localId, overrideChanges) => ({
    [CALL_BCPT_REST_API] : {
        types,
        method : 'fetchTableRow',
        tableName,
        localId,
        overrideChanges
    }
});

export const fetchTableRow = (tableName, localId, overrideChanges) => (dispatch) => {
    return dispatch(fetchTableRowWithApi(
        [ACTION_TABLE_ROW_REQUEST, ACTION_TABLE_ROW_SUCCESS, ACTION_TABLE_ROW_FAILURE],
        tableName,
        localId,
        overrideChanges
    ));
};

export const getOrFetchTableRow = (tableName, localId, overrideChanges) => (dispatch, getState) => {
    const existing = getTableRowByLocalIdOrExternalId(getState().tableItems[tableName], localId);
    if (existing) return Promise.resolve(existing);
    return dispatch(fetchTableRow(tableName, localId, overrideChanges));
};

export const ACTION_TABLE_ROW_GET_OR_CREATE_REQUEST = "ACTION_TABLE_ROW_GET_OR_CREATE_REQUEST";
export const ACTION_TABLE_ROW_GET_OR_CREATE_SUCCESS = "ACTION_TABLE_ROW_GET_OR_CREATE_SUCCESS";
export const ACTION_TABLE_ROW_GET_OR_CREATE_FAILURE = "ACTION_TABLE_ROW_GET_OR_CREATE_FAILURE";

export const getOrCreateTableRow = (tableName, localId, changes) => (dispatch, getState) => {
    const existing = getTableRowByLocalIdOrExternalId(getState().tableItems[tableName], localId);
    let existingLocalId = existing && existing.localId;
    return new Promise(resolve => {
        if (existingLocalId) {
            if (changes) return dispatch(tableRowChangeOnFeature(tableName, existingLocalId, changes)).then(changedItem => resolve(changedItem));
            return resolve(existing);
        } else dispatch(fetchTableRowWithApi(
            [
                ACTION_TABLE_ROW_GET_OR_CREATE_REQUEST,
                ACTION_TABLE_ROW_GET_OR_CREATE_SUCCESS,
                ACTION_TABLE_ROW_GET_OR_CREATE_FAILURE
            ], tableName,
            localId
        )).then(action => {
            if (changes)
                return dispatch(tableRowChangeOnFeature(tableName, localId, changes)).then(changedItem => resolve(changedItem));
            else resolve(tableItemFromResponse(action.response, tableName, localId));
        }, action => {
            const item = Object.assign({externalId: localId}, changes);
            dispatch(tableRowCreate(tableName, item));
            resolve(item);
        })
    });
};

export const resetTableRowChanges = (tableName, localId) => fetchTableRow(tableName, localId, true);

export const ACTION_TABLE_RESET_CHANGES = 'ACTION_TABLE_RESET_CHANGES';
export const resetTableChanges = (tableName) => (dispatch, getState) => {
    dispatch({
            type : ACTION_TABLE_RESET_CHANGES,
            tableName
    });
    const table = getState().tables[tableName];
    if (table) {
        const {pageNumber, itemsPerPage, sorted, filtered} = table;
        return dispatch(fetchTableData(tableName, pageNumber, itemsPerPage, sorted, filtered));
    }
};

export const ACTION_TABLE_ROW_CHANGE = 'ACTION_TABLE_ROW_CHANGE';

export const tableRowChange = (tableName, localId, changes) => ({
    type : ACTION_TABLE_ROW_CHANGE,
    tableName,
    localId,
    changes
});

export const tableRowChangeOnFeature = (tableName, localId, changes) => dispatch => {
    return new Promise(resolve => {
        dispatch({
            onComplete: (tableItem) => resolve(tableItem),
            ...tableRowChange(tableName, localId, changes)
        })
    });
};

export const ACTION_TABLE_SAVE_CHANGES_REQUEST = 'ACTION_TABLE_SAVE_CHANGES_REQUEST';
export const ACTION_TABLE_SAVE_CHANGES_SUCCESS = 'ACTION_TABLE_SAVE_CHANGES_SUCCESS';
export const ACTION_TABLE_SAVE_CHANGES_FAILURE = 'ACTION_TABLE_SAVE_CHANGES_FAILURE';

const saveChangesWithApi = (tableName) => ({
    [CALL_BCPT_REST_API] : {
        types : [ACTION_TABLE_SAVE_CHANGES_REQUEST, ACTION_TABLE_SAVE_CHANGES_SUCCESS, ACTION_TABLE_SAVE_CHANGES_FAILURE],
        method : 'saveChanges',
        tableName
    }
});

export const saveChanges = (tableName) => (dispatch) => {
    return dispatch(saveChangesWithApi(tableName));
};

export const ACTION_TABLE_SAVED_CHANGES = 'ACTION_TABLE_SAVED_CHANGES';

export const savedChanges = (tableName, localId, response) => ({
    type : ACTION_TABLE_SAVED_CHANGES,
    tableName,
    localId,
    response
});

export const ACTION_TABLE_ADD_NEW_ITEM = 'ACTION_TABLE_ADD_NEW_ITEM';

export const tableRowCreate = (tableName, initialData) => (dispatch, getState) => {
    const externalId = initialData && initialData.externalId;
    const existing = externalId && getTableRowByLocalIdOrExternalId(getState().tableItems[tableName], externalId);
    return new Promise((resolve, reject) => {
        if (existing)
            dispatch(tableRowChangeOnFeature(tableName, externalId.localId, initialData)).then(tableRow => resolve(tableRow), error => reject(error));
        else {
            dispatch(tableRowCreateWithPromise(tableName)).then(tableRow => {
                const {localId} = tableRow;
                if (initialData)
                    dispatch(tableRowChangeOnFeature(tableName, localId, initialData)).then(tableRow => resolve(tableRow), error => reject(error));
                else resolve(tableRow);
            });
        }
    });
};

const tableRowCreateWithPromise = (tableName) => (dispatch, getState) => new Promise((resolve) => {
    const table = getState().tables[tableName];
    const localId = Math.random().toString(36);
    dispatch({
        type: ACTION_TABLE_ADD_NEW_ITEM,
        tableName,
        pageNumber: (table && table.pageNumber) || 1,
        localId,
        onComplete: (tableRow) => resolve(Object.assign({localId}, tableRow))
    });
});

export const ACTION_TABLE_CLEAN_UP_SUBTABLE = 'ACTION_TABLE_CLEAN_UP_SUBTABLE';

export const cleanUpSubtable = (tableName) => ({
    type: ACTION_TABLE_CLEAN_UP_SUBTABLE,
    tableName
});

export const ACTION_CHANGE_DRAWER = 'ACTION_CHANGE_DRAWER';

export const changeDrawerState = (changes) => ({
    type: ACTION_CHANGE_DRAWER,
    changes
});



