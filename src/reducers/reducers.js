/**
 * Redux Reducers
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import {
    ACTION_TABLE_DATA_REQUEST,
    ACTION_TABLE_DATA_SUCCESS,
    ACTION_TABLE_DATA_FAILURE,
    ACTION_TABLE_EDIT,
    ACTION_TABLE_ADD_NEW_ITEM,
    ACTION_TABLE_SAVED_CHANGES,
    ACTION_TABLE_SAVE_CHANGES_SUCCESS,
    ACTION_TABLE_SAVE_CHANGES_FAILURE,
    ACTION_TABLE_ENABLE_EDIT_MODE,
    ACTION_TABLE_DELETE_CHECKED_ITEMS
} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const tables = (state = {
    persons: {displayName:"Доноры", data: {}},
    bloodDonations: {displayName:"Пакеты с плазмой", data: {}},
    bloodInvoices: {displayName:"Накладные", data: {}},
    bloodPools: {displayName:"Пулы", data: {}},
    productBatches: {displayName:"Загрузки", data: {}},
}, action) => {
    const {type, response, tableName, error} = action;
    if (ACTION_TABLE_DATA_REQUEST === type) {
        const table = Object.assign({}, state[tableName], {isFetching: true, isFetched:false});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_DATA_SUCCESS === type) {
        const table = Object.assign({},
            state[tableName],
            {data: response.entities[tableName] || {}, isFetched:true, isFetching:false, isEditing:false, isEdited:false}
        );
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_DATA_FAILURE === type) {
        const table = Object.assign({}, state[tableName], {isFetched:false, isFetching:false});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_ADD_NEW_ITEM === type) {
        const table = Object.assign({}, state[tableName], {isEditing: true});
        const data = Object.assign({}, table.data, {[Math.random().toString(36)]:{isEditing:true, isCreated:true}});
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_DELETE_CHECKED_ITEMS === type) {
        const table = Object.assign({}, state[tableName], {isEditing: true});
        const data = Object.assign({}, table.data);
        Object.keys(data)
            .filter(key => data[key].isChecked)
            .map(key => ({key, entity: Object.assign({}, data[key], {isChecked: false, isDeleted: true})}))
            .forEach(({key, entity}) => {
                if (entity.isCreated) delete data[key];
                else Object.assign(data, {[key]: entity})
            });
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName]: table});
    } else if (ACTION_TABLE_EDIT === type) {
        const {localId, changes} = action;
        const table = Object.assign({}, state[tableName], {isEdited: true});
        const entity = Object.assign({}, table.data[localId], changes, {isEdited:true});
        const data = Object.assign({}, table.data, {[localId]:entity});
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_SAVED_CHANGES === type) {
        const {localId, response} = action;
        const table = Object.assign({}, state[tableName]);
        const data = Object.assign({}, table.data);
        delete data[localId];
        Object.assign(data, response.entities[tableName]);
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_SAVE_CHANGES_SUCCESS === type) {
        const table = Object.assign({}, state[tableName], {isEditing:false, isEdited:false});
        const data = Object.assign({}, table.data);
        Object.keys(data)
            .map(key => ({key, entity: Object.assign({}, data[key], {isEditing:false})}))
            .forEach(({key, entity}) => Object.assign(data, {[key] : entity}));
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_SAVE_CHANGES_FAILURE === type && error !== undefined) {
        const {localId, errors} = error;
        const table = Object.assign({}, state[tableName]);
        const entity = Object.assign({}, table.data[localId], {errors});
        const data = Object.assign({}, table.data, {[localId]:entity});
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    } else if (ACTION_TABLE_ENABLE_EDIT_MODE === type) {
        const table = Object.assign({}, state[tableName], {isEditing:true});
        const data = Object.assign({}, table.data);
        Object.keys(data)
            .map(key => ({key, entity: Object.assign({}, data[key], {isEditing:true})}))
            .forEach(({key, entity}) => Object.assign(data, {[key] : entity}));
        Object.assign(table, {data});
        return Object.assign({}, state, {[tableName] : table});
    }
    return state;
};

const tableFilters = (state = {}, action) => {
    const {type, payload} = action;
    if ('@@router/LOCATION_CHANGE' === type && /\/table\/(\w+)\/?/.test(payload.pathname)) {
        const tableName = /\/table\/(\w+)\/?/g.exec(payload.pathname)[1];
        return Object.assign({}, state, {[tableName] : urlQueryAsFilters(payload.search)});
    }
    return state;
};

const errors = (state = {}, action) => {
    const {type, error, tableName} = action;
    if (ACTION_TABLE_DATA_FAILURE === type)
        return Object.assign({}, state, {['unableFetch' + tableName] : {error, timestamp: Date.now()}});
    return state;
};

const rootReducer = combineReducers({
    tables,
    errors,
    tableFilters,
    routing: routerReducer
});

export default rootReducer;

