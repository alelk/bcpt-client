/**
 * Actions
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import {CALL_BCPT_REST_API} from '../middleware/bcptRestApiMiddleware'

export const ACTION_TABLE_DATA_REQUEST = 'ACTION_TABLE_DATA_REQUEST';
export const ACTION_TABLE_DATA_SUCCESS = 'ACTION_TABLE_DATA_SUCCESS';
export const ACTION_TABLE_DATA_FAILURE = 'ACTION_TABLE_DATA_FAILURE';

const fetchTableDataWithApi = (tableName) => ({
    [CALL_BCPT_REST_API] : {
        types : [ACTION_TABLE_DATA_REQUEST, ACTION_TABLE_DATA_SUCCESS, ACTION_TABLE_DATA_FAILURE],
        method : 'fetchTableData',
        tableName
    }
});

export const fetchTableData = (tableName) => (dispatch) => {
    return dispatch(fetchTableDataWithApi(tableName));
};

export const ACTION_TABLE_EDIT = 'ACTION_TABLE_EDIT';

export const edit = (tableName, localId, changes) => ({
    type : ACTION_TABLE_EDIT,
    tableName,
    localId,
    changes
});

export const ACTION_TABLE_ADD_NEW_ITEM = 'ACTION_TABLE_ADD_NEW_ITEM';

export const addNew = (tableName) => ({
    type : ACTION_TABLE_ADD_NEW_ITEM,
    tableName
});

export const ACTION_TABLE_DELETE_CHECKED_ITEMS = 'ACTION_TABLE_DELETE_CHECKED_ITEMS';

export const deleteChecked = (tableName) => ({
    type : ACTION_TABLE_DELETE_CHECKED_ITEMS,
    tableName
});

export const ACTION_TABLE_ENABLE_EDIT_MODE = 'ACTION_TABLE_ENABLE_EDIT_MODE';

export const enableEditMode = (tableName) => ({
    type : ACTION_TABLE_ENABLE_EDIT_MODE,
    tableName
});

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