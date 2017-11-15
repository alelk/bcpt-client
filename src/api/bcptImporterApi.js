/**
 * Bcpt Importer Api
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import BcptConfig from '../util/BcptConfig'
import {postObject, getObject} from './fetchFunctions'

import { schema } from 'normalizr'
import urlencode from 'urlencode'

export const importProcessSchema = new schema.Entity('imports', {}, {
    idAttribute : value => value.importProcessId,
    processStrategy : value => Object.assign({}, value, {fileName : urlencode.decode(value.fileName)})
});
export const importProcessesSchema = new schema.Array(importProcessSchema);

export const importFile = (category, fileName) => {
    return postObject(BcptConfig.get("rest-api-uri") + "import/" + category + "?fileName=" + urlencode(fileName), undefined, importProcessSchema);
};

export const fetchImportResults = () => {
    return getObject(BcptConfig.get("rest-api-uri") + "import/", importProcessesSchema);
};
