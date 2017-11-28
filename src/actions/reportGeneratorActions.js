/**
 * Report Generator Actions
 *
 * Created by Alex Elkin on 27.11.2017.
 */

import {CALL_BCPT_REPORT_GENERATOR_API} from '../middleware/bcptReportGeneratorMiddleware'

export const ACTION_GENERATE_PRODUCT_BATCH_REQUEST = 'ACTION_GENERATE_PRODUCT_BATCH_REQUEST';
export const ACTION_GENERATE_PRODUCT_BATCH_SUCCESS = 'ACTION_GENERATE_PRODUCT_BATCH_SUCCESS';
export const ACTION_GENERATE_PRODUCT_BATCH_FAILURE = 'ACTION_GENERATE_PRODUCT_BATCH_FAILURE';

const generateProductBatchReportWithApi = (externalId, targetFormat) => ({
    [CALL_BCPT_REPORT_GENERATOR_API] : {
        types : [ACTION_GENERATE_PRODUCT_BATCH_REQUEST, ACTION_GENERATE_PRODUCT_BATCH_SUCCESS, ACTION_GENERATE_PRODUCT_BATCH_FAILURE],
        method : 'generateProductBatchReport',
        externalId,
        targetFormat
    }
});

export const generateProductBatchReport = (externalId, targetFormat) => (dispatch) => {
    return dispatch(generateProductBatchReportWithApi(externalId, targetFormat));
};
