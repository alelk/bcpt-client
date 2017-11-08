/**
 * Importer Actions
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import {CALL_BCPT_IMPORTER_API} from '../middleware/bcptImporterMiddleware'

export const ACTION_IMPORT_FILE_DATA_REQUEST = 'ACTION_IMPORT_FILE_DATA_REQUEST';
export const ACTION_IMPORT_FILE_DATA_SUCCESS = 'ACTION_IMPORT_FILE_DATA_SUCCESS';
export const ACTION_IMPORT_FILE_DATA_FAILURE = 'ACTION_IMPORT_FILE_DATA_FAILURE';

const importFileWithApi = (fileName, category) => ({
    [CALL_BCPT_IMPORTER_API] : {
        types : [ACTION_IMPORT_FILE_DATA_REQUEST, ACTION_IMPORT_FILE_DATA_SUCCESS, ACTION_IMPORT_FILE_DATA_FAILURE],
        method : 'importFile',
        fileName,
        category
    }
});

export const importFile = (fileName, category) => (dispatch) => {
    return dispatch(importFileWithApi(fileName, category));
};