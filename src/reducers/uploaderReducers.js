/**
 * Uploader Reducers
 *
 * Created by Uploader Reducers on 02.11.2017.
 */

import {
    ACTION_UPLOAD_FILE_REQUEST,
    ACTION_UPLOAD_FILE_SUCCESS,
    ACTION_UPLOAD_FILE_FAILURE,
    ACTION_FETCH_UPLOADED_FILES_REQUEST,
    ACTION_FETCH_UPLOADED_FILES_SUCCESS,
    ACTION_FETCH_UPLOADED_FILES_FAILURE,
    ACTION_REMOVE_FILE_SUCCESS
} from '../actions/uploaderActions'
import {objectWith} from './util'

const categoryWith = (state, category, changes) => {
    const result = objectWith(state[category], changes);
    return objectWith(state, {[category]:result});
};

export const uploads = (state={
    dbf: {displayName: "DBF", fileType:"text/plain", fileExtension:"txt"},
    ant: {displayName: "ANT", fileExtension:"ant"},
}, action) => {
    const {type, category} = action;
    if (ACTION_FETCH_UPLOADED_FILES_REQUEST === type)
        return categoryWith(state, category, {isFetching:true, isFetched:false});
    else if (ACTION_FETCH_UPLOADED_FILES_SUCCESS === type)
        return categoryWith(state, category, {isFetching:false, isFetched:true});
    else if (ACTION_FETCH_UPLOADED_FILES_FAILURE === type)
        return categoryWith(state, category, {isFetching:false, isFetched:false});
    return state;
};

const uploadedFileWith = (state, category, fileName, changes) => {
    return categoryWith(state, category, {[fileName] : changes});
};

const filesFromResponse = (response) => {
    return response && response.entities && response.entities.files;
};

const fileFromResponse = (fileName, response) => {
    const files = filesFromResponse(response);
    return files && files[fileName];
};

export const uploadedFiles = (state = {}, action) => {
    const {type, category, file, response, error} = action;
    const fileName = file && file.name;
    if (ACTION_UPLOAD_FILE_REQUEST === type)
        return uploadedFileWith(state, category, fileName,
            {isFetching:true, isFetched:false, error:undefined, fileName, lastModified: new Date().toISOString()});
    else if (ACTION_UPLOAD_FILE_SUCCESS === type)
        return uploadedFileWith(state, category, fileName,
            Object.assign({isFetching:false, isFetched:true, error:undefined}, fileFromResponse(fileName, response)));
    else if (ACTION_UPLOAD_FILE_FAILURE === type)
        return uploadedFileWith(state, category, fileName, {isFetching:false, isFetched:false, error});
    else if (ACTION_FETCH_UPLOADED_FILES_SUCCESS === type)
        return categoryWith(state, category, filesFromResponse(response));
    else if (ACTION_REMOVE_FILE_SUCCESS === type) {
        const files = objectWith(state[category]);
        delete files[action.fileName];
        return objectWith(state, {[category] : files});
    }
    return state;
};