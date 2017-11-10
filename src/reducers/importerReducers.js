/**
 * Importer Reducers
 *
 * Created by Alex Elkin on 09.11.2017.
 */

import {
    ACTION_IMPORT_FILE_DATA_SUCCESS
} from '../actions/importerActions'

import {objectWith} from './util'

const importsFromResponse = (response) => response && response.entities && response.entities.imports;

export const imports = (state = {}, action) => {
    const {type, response} = action;
    if (ACTION_IMPORT_FILE_DATA_SUCCESS == type)
        return objectWith(state, importsFromResponse(response));
    return state;
};