/**
 * Bcpt Uploader API
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import BcptConfig from '../util/BcptConfig'
import {fetchBcptApi, getObject} from './fetchFunctions'

import { schema } from 'normalizr'
import urlencode from 'urlencode'

const uploadedFileSchema = new schema.Entity('files', {}, {
    idAttribute : value => urlencode.decode(value.fileName),
    processStrategy : file => Object.assign({}, file, {fileName : urlencode.decode(file.fileName)})
});
const uploadedFilesSchema = new schema.Array(uploadedFileSchema);

export const uploadFile = (file, category) => {
    const data = new FormData();
    data.append("file", file);
    return fetchBcptApi(BcptConfig.get("rest-api-uri") + "upload/" + category + "?fileName=" + urlencode(file.name), {
        method: 'post',
        body: data
    }, uploadedFileSchema)
};

export const fetchUploadedFileList = (category) => {
    return getObject(BcptConfig.get("rest-api-uri") + "upload/" + category, uploadedFilesSchema);
};

export const downloadFile = (category, fileName) => {
    window.open(BcptConfig.get("rest-api-uri") + "upload/download/" + category + "?fileName=" + urlencode(fileName), '_blank');
};

export const deleteFile = function (category, fileName) {
    return fetch(BcptConfig.get("rest-api-uri") + "upload/" + category + "?fileName=" + urlencode(fileName), {method:"delete"})
};