/**
 * Bcpt Uploader Middleware
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import {uploadFile, fetchUploadedFileList, downloadFile} from '../api/bcptUploaderApi'
import {validateCallApiTypes, validateIsString} from './util'

export const CALL_BCPT_UPLOADER_API = 'CALL_BCPT_UPLOADER_API';

export default store => nextProcedure => action => {
    const callApi = action[CALL_BCPT_UPLOADER_API];
    if (callApi === undefined) {
        nextProcedure(action);
        return;
    }

    const {types, method, file, fileName, category} = callApi;
    validateIsString(method, "Expected a method signature");
    validateIsString(category, "Expected a category");
    validateCallApiTypes(types);

    const actionWith = data => {
        return Object.assign({}, callApi, data);
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType}));

    if (/uploadFile/.test(method)) {
        uploadFile(file, category).then(
            response => nextProcedure(actionWith({type: successType, category, response})),
            error => nextProcedure(actionWith({type: failureType, category, error: "Unable to upload file " + file + " to '" + category + "': " + error}))
        )
    } else if (/fetchUploadedFiles/.test(method)) {
        fetchUploadedFileList(category).then(
            response => nextProcedure(actionWith({type: successType, category, response})),
            error => nextProcedure(actionWith({type: failureType, category, error: "Unable to fetch uploaded files from '" + category + "': " + error}))
        )
    } else if (/downloadFile/.test(method)) {
        downloadFile(category, fileName);
        nextProcedure(actionWith({type: successType, category}))
    } else {
        nextProcedure(actionWith({type: failureType, category, error: "Unexpected method: " + method}))
    }
}
