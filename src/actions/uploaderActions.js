/**
 * Importer Actions
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import {CALL_BCPT_UPLOADER_API} from '../middleware/bcptUploaderMiddleware'

export const ACTION_UPLOAD_FILE_REQUEST = 'ACTION_UPLOAD_FILE_REQUEST';
export const ACTION_UPLOAD_FILE_SUCCESS = 'ACTION_UPLOAD_FILE_SUCCESS';
export const ACTION_UPLOAD_FILE_FAILURE = 'ACTION_UPLOAD_FILE_FAILURE';

const uploadFileWithApi = (file, category) => ({
    [CALL_BCPT_UPLOADER_API] : {
        types : [ACTION_UPLOAD_FILE_REQUEST, ACTION_UPLOAD_FILE_SUCCESS, ACTION_UPLOAD_FILE_FAILURE],
        method : 'uploadFile',
        file,
        category
    }
});

export const uploadFile = (file, category) => (dispatch) => {
    return dispatch(uploadFileWithApi(file, category));
};

export const ACTION_FETCH_UPLOADED_FILES_REQUEST = 'ACTION_FETCH_UPLOADED_FILES_REQUEST';
export const ACTION_FETCH_UPLOADED_FILES_SUCCESS = 'ACTION_FETCH_UPLOADED_FILES_SUCCESS';
export const ACTION_FETCH_UPLOADED_FILES_FAILURE = 'ACTION_FETCH_UPLOADED_FILES_FAILURE';

const fetchUploadedFilesWithApi = (category) => ({
    [CALL_BCPT_UPLOADER_API] : {
        types : [ACTION_FETCH_UPLOADED_FILES_REQUEST, ACTION_FETCH_UPLOADED_FILES_SUCCESS, ACTION_FETCH_UPLOADED_FILES_FAILURE],
        method : 'fetchUploadedFiles',
        category
    }
});

export const fetchUploadedFiles = (category) => (dispatch) => {

};