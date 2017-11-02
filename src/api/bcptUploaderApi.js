/**
 * Bcpt Uploader API
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import BcptConfig from '../util/BcptConfig'
import {fetchBcptApi} from './fetchFunctions'

import { schema } from 'normalizr'
import urlencode from 'urlencode'

const uploadedFileSchema = new schema.Entity('files', {}, { idAttribute : value => value.fileName });
const uploadedFilesSchema = new schema.Array(uploadedFileSchema);

export const uploadFile = (file, category) => {
    const data = new FormData();
    data.append("file", file);
    return fetchBcptApi(BcptConfig.get("rest-api-uri") + "upload/" + category + "?fileName=" + urlencode(file.name), {
        method: 'post',
        body: data
    }, uploadedFileSchema)
};