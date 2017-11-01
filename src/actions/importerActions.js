/**
 * Importer Actions
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import {CALL_BCPT_REST_API} from '../middleware/bcptRestApiMiddleware'

export const ACTION_IMPORTER_IMPORT_DBF_REQUEST = 'ACTION_IMPORTER_IMPORT_DBF_REQUEST';
export const ACTION_IMPORTER_IMPORT_DBF_SUCCESS = 'ACTION_IMPORTER_IMPORT_DBF_SUCCESS';
export const ACTION_IMPORTER_IMPORT_DBF_FAILURE = 'ACTION_IMPORTER_IMPORT_DBF_FAILURE';

const importDbfFileWithApi = (file) => ({
    [CALL_BCPT_REST_API] : {
        types : [ACTION_IMPORTER_IMPORT_DBF_REQUEST, ACTION_IMPORTER_IMPORT_DBF_SUCCESS, ACTION_IMPORTER_IMPORT_DBF_FAILURE],
        method : 'importDbfFile',
        file
    }
});

export const importDbfFile = (file) => (dispatch) => {
    return dispatch(importDbfFileWithApi(file));
};