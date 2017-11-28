/**
 * BCPT Report Generator Middleware
 *
 * Created by Alex Elkin on 27.11.2017.
 */

import {generateProductBatchReport} from '../api/bcptReportGeneratorApi'
import {validateCallApiTypes, validateIsString} from './util'

export const CALL_BCPT_REPORT_GENERATOR_API = 'CALL_BCPT_REPORT_GENERATOR_API';

export default store => nextProcedure => action => {
    const callApi = action[CALL_BCPT_REPORT_GENERATOR_API];
    if (callApi === undefined) {
        nextProcedure(action);
        return;
    }

    const {types, method, externalId, targetFormat} = callApi;
    validateIsString(method, "Expected a method signature");
    validateIsString(targetFormat, "Expected a target format");
    validateCallApiTypes(types);

    const actionWith = data => {
        return Object.assign({}, callApi, data);
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType}));

    if (/generateProductBatchReport/.test(method)) {
        generateProductBatchReport(externalId, targetFormat);
        nextProcedure(actionWith({type: successType}))
    } else {
        nextProcedure(actionWith({type: failureType, error: "Unexpected method: " + method}))
    }
}