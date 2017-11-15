/**
 * Importer Actions
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import {CALL_BCPT_IMPORTER_API} from '../middleware/bcptImporterMiddleware'
import {CALL_BCPT_WEB_SOCKET} from '../middleware/bcptWebSocketMiddleware'

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

export const ACTION_FETCH_IMPORT_RESULTS_REQUEST = 'ACTION_FETCH_IMPORT_RESULTS_REQUEST';
export const ACTION_FETCH_IMPORT_RESULTS_SUCCESS = 'ACTION_FETCH_IMPORT_RESULTS_SUCCESS';
export const ACTION_FETCH_IMPORT_RESULTS_FAILURE = 'ACTION_FETCH_IMPORT_RESULTS_FAILURE';

const fetchImportResultsWithApi = () => ({
    [CALL_BCPT_IMPORTER_API] : {
        types : [ACTION_FETCH_IMPORT_RESULTS_REQUEST, ACTION_FETCH_IMPORT_RESULTS_SUCCESS, ACTION_FETCH_IMPORT_RESULTS_FAILURE],
        method : 'fetchImportResults'
    }
});

export const fetchImportResults = () => (dispatch) => dispatch(fetchImportResultsWithApi());

export const ACTION_SUBSCRIBE_IMPORT_PROCESSES_REQUEST = 'ACTION_SUBSCRIBE_IMPORT_PROCESSES_REQUEST';
export const ACTION_SUBSCRIBE_IMPORT_PROCESSES_SUCCESS = 'ACTION_SUBSCRIBE_IMPORT_PROCESSES_SUCCESS';
export const ACTION_SUBSCRIBE_IMPORT_PROCESSES_FAILURE = 'ACTION_SUBSCRIBE_IMPORT_PROCESSES_FAILURE';

const subscribeImporterProcessesWithApi = () => ({
    [CALL_BCPT_WEB_SOCKET] : {
        types : [ACTION_SUBSCRIBE_IMPORT_PROCESSES_REQUEST, ACTION_SUBSCRIBE_IMPORT_PROCESSES_SUCCESS, ACTION_SUBSCRIBE_IMPORT_PROCESSES_FAILURE],
        method : 'subscribeImporterProcesses'
    }
});

export const subscribeImporterProcesses = () => dispatch => dispatch(subscribeImporterProcessesWithApi());

export const ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_REQUEST = 'ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_REQUEST';
export const ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_SUCCESS = 'ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_SUCCESS';
export const ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_FAILURE = 'ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_FAILURE';

const unsubscribeImporterProcessesWithApi = () => ({
    [CALL_BCPT_WEB_SOCKET] : {
        types : [ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_REQUEST, ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_SUCCESS, ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_FAILURE],
        method : 'subscribeImporterProcesses'
    }
});

export const unsubscribeImporterProcesses = () => dispatch => dispatch(unsubscribeImporterProcessesWithApi());

export const ACTION_IMPORTER_PROCESSES_UPDATE = "ACTION_IMPORTER_PROCESSES_UPDATE";

export const updateImporterProcesses = (response) => {
    return {
        type : ACTION_IMPORTER_PROCESSES_UPDATE,
        response
    }
};