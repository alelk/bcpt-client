/**
 * BCPT importer Middleware
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import {validateCallApiTypes, validateIsString} from './util'
import {importFile} from '../api/bcptImporterApi'

export const CALL_BCPT_IMPORTER_API = 'CALL_BCPT_IMPORTER_API';

export default store => nextProcedure => action => {
    const callApi = action[CALL_BCPT_IMPORTER_API];
    if (callApi === undefined) {
        nextProcedure(action);
        return;
    }

    const {types, method, fileName, category} = callApi;
    validateIsString(method, "Expected a method signature");
    validateCallApiTypes(types);

    const actionWith = data => {
        return Object.assign({}, callApi, data);
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType}));

    if (/importFile/.test(method)) {
        importFile(category, fileName).then(
            response => nextProcedure(actionWith({type: successType, response})),
            error => nextProcedure(actionWith({type: failureType, error: "Unable to import file '" + fileName + "' category '" + category + "': " + error}))
        )
    } else {
        nextProcedure(actionWith({type: failureType, error: "Unexpected method: " + method}))
    }
}