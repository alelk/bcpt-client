/**
 * BCPT Rest Api Middleware
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import {getTable, getTablePage, postTableEntity, putTableEntity, deleteTableEntity} from '../api/bcptRestApi'
import {savedChanges} from '../actions/actions'

export const CALL_BCPT_REST_API = 'CALL_BCPT_REST_API';

export default store => nextProcedure => action => {
    const callApi = action[CALL_BCPT_REST_API];
    if (callApi === undefined) {
        nextProcedure(action);
        return;
    }

    const {types, method, tableName} = callApi;
    if (typeof method !== 'string')
        throw new Error('Expected an method signature, but: ' + method);
    if (!Array.isArray(types) || types.length !== 3)
        throw new Error('Expected an array of three action types.');
    if (!types.every(type => typeof type === 'string'))
        throw new Error('Expected action types to be strings.');

    const actionWith = data => {
        return Object.assign({}, callApi, data);
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType}));

    if (/fetchTableData/.test(method)) {
        const {pageNumber, itemsPerPage, sorted, filtered} = callApi;
        getTablePage(tableName, pageNumber, itemsPerPage, sorted, filtered).then(
            response => nextProcedure(actionWith({type: successType, tableName, response})),
            error => nextProcedure(actionWith({type: failureType, tableName, error: "Unable to fetch data from table '" + tableName + "': " + error}))
        )
    } else if (/saveChanges/.test(method)) {
        const entities = store.getState().tables[tableName];
        if (!entities)
            nextProcedure(actionWith({type: failureType, error: "Unable to save table '" + tableName + "': no entities found!"}));
        else if (!entities.isEdited)
            nextProcedure(actionWith({type: successType, message: "No changes found in the '" + tableName + "' table"}));
        else {
            Promise.all(Object.keys(entities.data).map(key => {
                const e = entities.data[key];
                let promise;
                if (e.isCreated)
                    promise = postTableEntity(tableName, e);
                else if (e.isDeleted)
                    promise = deleteTableEntity(tableName, key).then(response => Promise.resolve({entities:{}}));
                else if (e.isEdited)
                    promise = putTableEntity(tableName, key, e);
                else
                    return undefined;
                promise.then(response => {
                    nextProcedure(savedChanges(tableName, key, response));
                    return Promise.resolve(response)
                });
                return promise.catch(errors => Promise.reject({localId:key, errors}));
            })).then(
                results => nextProcedure(actionWith({type: successType, tableName})),
                error => nextProcedure(actionWith({type: failureType, tableName, error}))
            )
        }
    }



}