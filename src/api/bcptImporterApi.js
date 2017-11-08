/**
 * Bcpt Importer Api
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import BcptConfig from '../util/BcptConfig'
import {postObject} from './fetchFunctions'

import urlencode from 'urlencode'

export const importFile = (category, fileName) => {
    return postObject(BcptConfig.get("rest-api-uri") + "import/" + category + "?fileName=" + urlencode(fileName));
};
