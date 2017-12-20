/**
 * BCPT Rest Api Middleware
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import {getTablePage, getTableEntity, postTableEntity, putTableEntity, deleteTableEntity} from '../api/bcptRestApi'
import {savedChanges} from '../actions/actions'
import {validateCallApiTypes, validateIsString} from './util'

export const CALL_BCPT_REST_API = 'CALL_BCPT_REST_API';

export default store => nextProcedure => action => {
    const callApi = action[CALL_BCPT_REST_API];
    if (callApi === undefined) {
        return nextProcedure(action);

    }

    return new Promise((resolvePromise, rejectPromise) => {
        const {types, method, tableName} = callApi;
        validateIsString(method, "Expected a method signature");
        validateCallApiTypes(types);

        const actionWith = data => {
            return Object.assign({}, callApi, data);
        };

        const resolveWithAction = data => {
            const result = actionWith(data);
            resolvePromise(result);
            return result;
        };

        const rejectWithAction = data => {
            const result = actionWith(data);
            rejectPromise(result);
            return result;
        };

        const [requestType, successType, failureType] = types;
        nextProcedure(actionWith({type: requestType}));

        if (/fetchTableData/.test(method)) {
            const {pageNumber, itemsPerPage, sorted, filtered} = callApi;
            getTablePage(tableName, pageNumber, itemsPerPage, sorted, filtered).then(
                response => nextProcedure(resolveWithAction({type: successType, tableName, response})),
                error => nextProcedure(rejectWithAction({
                    type: failureType,
                    tableName,
                    error: "Unable to fetch data from table '" + tableName + "': " + error
                }))
            )
        } else if (/fetchTableRow/.test(method)) {
            const {localId} = callApi;
            const errorMsg = "Unable to fetch data from table '" + tableName + "': ";
            if (localId == null || /^\s*$/.test(localId))
                nextProcedure(rejectWithAction({
                    type: failureType,
                    tableName,
                    error: errorMsg + "Table row id is not specified!"
                }));
            else
                return getTableEntity(tableName, localId).then(
                    response => nextProcedure(resolveWithAction({type: successType, tableName, response})),
                    error => nextProcedure(rejectWithAction({type: failureType, tableName, error: errorMsg + error}))
                )
        }
        else if (/saveChanges/.test(method)) {
            const items = store.getState().tableItems[tableName];
            const table = store.getState().tables[tableName];
            if (!items || !table || !table.isEdited)
                nextProcedure(resolveWithAction({
                    type: successType,
                    message: "No changes found in the '" + tableName + "' table"
                }));
            else {
                Promise.all(Object.keys(items).map(key => {
                    const item = items[key];
                    let promise;
                    if (item.isCreated)
                        promise = postTableEntity(tableName, item);
                    else if (item.isDeleted)
                        promise = deleteTableEntity(tableName, key).then(response => Promise.resolve({entities: {}}));
                    else if (item.isEdited)
                        promise = putTableEntity(tableName, key, item);
                    else
                        return undefined;
                    promise.then(response => {
                        nextProcedure(savedChanges(tableName, key, response));
                        return Promise.resolve(response)
                    });
                    return promise.catch(errors => Promise.reject({localId: key, errors}));
                })).then(
                    results => nextProcedure(resolveWithAction({type: successType, tableName})),
                    error => nextProcedure(rejectWithAction({type: failureType, tableName, error}))
                )
            }
        } else
            return nextProcedure(rejectWithAction({type: failureType, error: "Unknown method: " + method}));
    });
}