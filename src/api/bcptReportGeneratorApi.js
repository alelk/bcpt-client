/**
 * Report Generator API
 *
 * Created by Alex Elkin on 27.11.2017.
 */

import BcptConfig from '../util/BcptConfig'
import urlencode from 'urlencode'

export const generateProductBatchReport = (externalId, targetFormat) => {
    window.open(BcptConfig.get("rest-api-uri") + "reports/productBatch?externalId=" + urlencode(externalId) +
        "&targetFormat=" + urlencode(targetFormat), '_blank');
};
