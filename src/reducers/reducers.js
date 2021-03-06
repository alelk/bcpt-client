/**
 * Redux Reducers
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import {
    ACTION_TABLE_DATA_REQUEST,
    ACTION_TABLE_ROW_SUCCESS,
    ACTION_TABLE_ROW_FAILURE,
    ACTION_TABLE_ROW_GET_OR_CREATE_SUCCESS,
    ACTION_TABLE_DATA_SUCCESS,
    ACTION_TABLE_DATA_FAILURE,
    ACTION_TABLE_MODIFY_INFO,
    ACTION_TABLE_CHECK_ROW,
    ACTION_TABLE_DELETE_ROW,
    ACTION_TABLE_EDIT_ROW,
    ACTION_TABLE_RESET_CHANGES,
    ACTION_TABLE_ROW_CHANGE,
    ACTION_TABLE_INVALIDATE_PAGES,
    ACTION_TABLE_ADD_NEW_ITEM,
    ACTION_TABLE_SAVED_CHANGES,
    ACTION_TABLE_SAVE_CHANGES_SUCCESS,
    ACTION_TABLE_SAVE_CHANGES_FAILURE,
    ACTION_TABLE_CLEAN_UP_SUBTABLE,
    ACTION_CHANGE_DRAWER
} from '../actions/actions'

import {objectWith} from './util'

import {uploads, uploadedFiles} from './uploaderReducers'

import {imports} from './importerReducers'

import {stompClient, stompClientSubscriptions} from './webSocketReducers'

import {poolScanningConfigs, poolScanningErrors, scannedDonations, scannedPools, poolScanner} from './poolScanningReducers'

import {extractTableName, isSubtable} from '../util/util'

import {urlQueryAsFilters} from '../components/table/Table'

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const tableWith = (tables, tableName, changes) => {
    const table = objectWith(tables[tableName], changes);
    return objectWith(tables, {[tableName]:table});
};

const tables = (state = {
    persons: {displayName:"Доноры"},
    bloodDonations: {displayName:"Пакеты с плазмой"},
    bloodInvoices: {displayName:"Накладные"},
    bloodInvoiceSeries: {displayName:"Серии ПДФ"},
    bloodPools: {displayName:"Пулы"},
    bloodPoolAnalysis: {displayName:"Анализы пулов"},
    productBatches: {displayName:"Загрузки"},
}, action) => {
    const {type, tableName, localId, error, changes} = action;
    if (ACTION_TABLE_DATA_REQUEST === type) {
        return tableWith(state, tableName, {isFetching: true, isFetched:false, error:undefined});
    } else if (ACTION_TABLE_DATA_SUCCESS === type) {
        const {pageNumber, response} = action;
        const page = pageFromResponse(pageNumber, response);
        const pagesCount = (page && page.pagesCount) || undefined;
        const itemsCount = (page && page.itemsCount) || undefined;
        return tableWith(state, tableName, {isFetched:true, isFetching:false, pagesCount, itemsCount});
    } else if (ACTION_TABLE_DATA_FAILURE === type) {
        return tableWith(state, tableName, {isFetched:false, isFetching:false, error});
    } else if (ACTION_TABLE_INVALIDATE_PAGES === type) {
        return tableWith(state, tableName, {isFetched:false, isFetching:false});
    } else if (ACTION_TABLE_MODIFY_INFO === type) {
        return tableWith(state, tableName, changes);
    } else if (ACTION_TABLE_DELETE_ROW === type && localId) {
        return tableWith(state, tableName, {isEdited:true, isEditing:true});
    } else if (ACTION_TABLE_EDIT_ROW === type && localId) {
        return tableWith(state, tableName, {isEditing:true});
    } else if (ACTION_TABLE_ROW_CHANGE === type && localId) {
        return tableWith(state, tableName, {isEdited:true, isEditing:true});
    } else if (ACTION_TABLE_RESET_CHANGES === type || ACTION_TABLE_SAVE_CHANGES_SUCCESS === type) {
        return tableWith(state, tableName, {isEdited:false, isEditing:false, isFetched:false, isFetching:false, checkedItems:undefined});
    } else if (ACTION_TABLE_ADD_NEW_ITEM === type) {
        return tableWith(state, tableName, {isEditing:true, checkedItems:undefined});
    } else if (ACTION_TABLE_CLEAN_UP_SUBTABLE && isSubtable(tableName)) {
        const tables = objectWith(state);
        delete tables[tableName];
        return tables;
    }
    return state;
};

const pageFromResponse = (pageNumber, response) => {
    return response && response.entities && response.entities.pages && response.entities.pages[pageNumber];
};

const pageWith = (tablePages, tableName, pageNumber, changes) => {
    const pages = objectWith(tablePages[tableName]);
    pages[pageNumber] = objectWith(pages[pageNumber], changes);
    let result = objectWith(tablePages, {[tableName]:pages});
    const created = pages[pageNumber].created;
    created && created.forEach(localId => result = pageItemsAddCreated(result, tableName, pageNumber, localId));
    return result;
};

const pageItemsAddCreated = (tablePages, tableName, pageNumber, localId) => {
    const pages = objectWith(tablePages[tableName]);
    const page = pages && objectWith(pages[pageNumber]);
    page.created = [localId, ...page.created || []];
    if (!Array.isArray(page.items) || !page.items.find(item => item === localId))
        page.items = [localId, ...page.items || []];
    pages[pageNumber] = page;
    return objectWith(tablePages, {[tableName]:pages});
};

const pageItemsRemoveCreated = (tablePages, tableName, pageNumber, localId) => {
    const pageWithCreatedItem = tablePages[tableName] && Object.keys(tablePages[tableName])
            .map(pageNumber => ({pageNumber, page:tablePages[tableName][pageNumber]}))
            .find(({page}) => page.created && (page.created.findIndex(item => item === localId) > -1));
    if (!pageWithCreatedItem) return tablePages;
    const page = objectWith(pageWithCreatedItem.page);
        page.created = page.created && page.created.filter(id => id !== localId);
        page.items = page.items && page.items.filter(id => id !== localId);
    const pages = objectWith(tablePages[tableName], {[pageWithCreatedItem.pageNumber] : page});
    return objectWith(tablePages, {[tableName]: pages});
};

const pagesInvalidate = (tablePages, tableName) => {
    const pages = objectWith(tablePages[tableName]);
    Object.keys(pages).forEach(pageNumber => {
        pages[pageNumber] = objectWith(pages[pageNumber], {isFetching: false, isFetched: false, items:[]});
    });
    return objectWith(tablePages, {[tableName] : pages});
};

export const isPageFetched = (tablePages, tableName, pageNumber) => {
    const page = tablePages && tablePages[tableName] && tablePages[tableName][pageNumber];
    return page && page.isFetched;
};

const tablePages = (state = {}, action) => {
    const {type, tableName, pageNumber, response, error, localId} = action;
    if (ACTION_TABLE_DATA_REQUEST === type)
        return pageWith(state, tableName, pageNumber, {isFetching: true, isFetched: false});
    else if (ACTION_TABLE_DATA_SUCCESS === type)
        return pageWith(state, tableName, pageNumber, Object.assign(
            {isFetching: false, isFetched: true},
            pageFromResponse(pageNumber, response) || (state[tableName] && state[tableName][pageNumber])
        ));
    else if (ACTION_TABLE_DATA_FAILURE === type)
        return pageWith(state, tableName, pageNumber,{isFetching: false, isFetched: true, error});
    else if (ACTION_TABLE_RESET_CHANGES === type)
        return objectWith(state, {[tableName]:{}});
    else  if (ACTION_TABLE_INVALIDATE_PAGES === type)
        return pagesInvalidate(state, tableName);
    else if (ACTION_TABLE_ADD_NEW_ITEM === type)
        return pageItemsAddCreated(state, tableName, pageNumber, localId);
    else if (ACTION_TABLE_SAVED_CHANGES === type)
        return pageItemsRemoveCreated(state, tableName, pageNumber, localId);
    else if (ACTION_TABLE_CLEAN_UP_SUBTABLE && isSubtable(tableName)) {
        const pages = objectWith(state);
        delete pages[tableName];
        return pages;
    }
    return state;
};

const itemHasChanges = (items, localId) => {
    return items && localId ? items[localId] && (items[localId].isEditing || items[localId].isDeleted) : false;
};

const mergeItems = (items, newItems, overrideChanges = false) => {
    const result = objectWith(items);
    newItems && Object.keys(newItems)
        .filter(localId => overrideChanges || !itemHasChanges(items, localId))
        .map(localId => ({localId, item:objectWith(newItems[localId], {isChecked:result[localId] && result[localId].isChecked})}))
        .forEach(({localId, item})=> result[localId] = item);
    return result;
};

const tableItemsMerge = (tableItems, tableName, newItems, overrideChanges = false) => {
    const items = mergeItems(tableItems[tableName], newItems, overrideChanges);
    return Object.assign({}, tableItems, {[tableName] : items});
};

const tableItemsWith = (tableItems, tableName, newItems) => {
    const items = objectWith(tableItems[tableName], newItems);
    return Object.assign({}, tableItems, {[tableName] : items});
};

const tableItemWith = (tableItems, tableName, itemLocalId, itemChanges) => {
    const item = Object.assign({}, tableItems[tableName] && tableItems[tableName][itemLocalId], itemChanges);
    return tableItemsWith(tableItems, tableName, {[itemLocalId] : item});
};

const tableItemsDeleteItem = (items, tableName, localId) => {
    const tableItems = tableItemsWith(items, tableName);
    console.log("delete", tableItems);
    delete tableItems[tableName][localId];
    return tableItems;
};

/**
 * Find local ids of checked items
 *
 * @param tableItems all items for the all tables
 * @param tableName table name
 * @returns {*|Array} local ids of checked items
 */
export const tableItemsChecked = (tableItems, tableName) => {
    const items = tableItems[tableName];
    return items && Object.keys(items)
            .map(localId => ({localId, item:items[localId]}))
            .filter(({localId, item}) => item.isChecked)
            .map(({localId, item}) => localId);
};

export const tableItemsFromResponse = (response, tableName) =>
    response && response.entities && response.entities[tableName];


export const tableItemFromResponse = (response, tableName, externalId) => {
    const items = tableItemsFromResponse(response, tableName);
    return items && items[externalId];
};

const tableItems = (state = {}, action) => {
    const {type, tableName, localId, changes, response, error, overrideChanges, onComplete} = action;
    if (ACTION_TABLE_DATA_SUCCESS === type || ACTION_TABLE_ROW_SUCCESS === type || ACTION_TABLE_ROW_GET_OR_CREATE_SUCCESS === type) {
        const tableRealName = extractTableName(tableName);
        if (!tableItemsFromResponse(response, tableRealName)) return state;
        return tableItemsMerge(state, tableName, response.entities[tableRealName], overrideChanges);
    } else if (ACTION_TABLE_ROW_FAILURE === type) {
        if (overrideChanges) return tableItemsDeleteItem(state, tableName, localId);
        return state;
    } else if (ACTION_TABLE_CHECK_ROW === type) {
        return tableItemWith(state, tableName, localId, changes);
    } else if (ACTION_TABLE_DELETE_ROW === type && localId) {
        return tableItemWith(state, tableName, localId, {isDeleted:true});
    } else if (ACTION_TABLE_EDIT_ROW === type && localId) {
        return tableItemWith(state, tableName, localId, {isEditing:true, isDeleted:false});
    } else if (ACTION_TABLE_ROW_CHANGE === type && localId) {
        const newState = tableItemWith(state, tableName, localId, objectWith({isEdited:true, isEditing:true}, changes));
        onComplete && onComplete(newState[tableName] && newState[tableName][localId]);
        return newState;
    } else if (ACTION_TABLE_RESET_CHANGES === type) {
        return objectWith(state, {[tableName]:{}})
    } else if (ACTION_TABLE_SAVED_CHANGES === type) {
        const newItems = tableItemsDeleteItem(state, tableName, localId);
        return (response && response.entities && response.entities[tableName] &&
            tableItemsWith(newItems, tableName, response.entities[tableName])
            ) || newItems;
    } else if (ACTION_TABLE_SAVE_CHANGES_FAILURE === type) {
        const {errors, localId} = error;
        return tableItemWith(state, tableName, localId, {errors})
    } else if (ACTION_TABLE_ADD_NEW_ITEM === type) {
        const newState = tableItemWith(state, tableName, localId, {isEditing:true, isCreated:true, creationTimestamp: Date.now()});
        onComplete && onComplete(newState[tableName] && newState[tableName][localId]);
        return newState;
    } else if (ACTION_TABLE_CLEAN_UP_SUBTABLE && isSubtable(tableName)) {
        const items = objectWith(state);
        delete items[tableName];
        return items;
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

const drawer = (state = {}, action) => {
    const {type, changes} = action;
    if (ACTION_CHANGE_DRAWER === type)
        return objectWith(state, changes);
    return state;
};

const rootReducer = combineReducers({
    tables,
    tablePages,
    tableItems,
    errors,
    tableFilters,
    drawer,
    uploads,
    uploadedFiles,
    imports,
    stompClient,
    stompClientSubscriptions,
    poolScanningConfigs,
    poolScanningErrors,
    scannedDonations,
    scannedPools,
    poolScanner,
    routing: routerReducer
});

export default rootReducer;

