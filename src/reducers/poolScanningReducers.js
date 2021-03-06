/**
 * Pool Scanning Reducers
 *
 * Created by Alex Elkin on 13.12.2017.
 */

import {
    ACTION_CHANGE_SCANNING_CONFIG,
    ACTION_SET_SCANNING_ERRORS,
    ACTION_ADD_SCANNED_DONATION_REQUEST,
    ACTION_ADD_SCANNED_DONATION_SUCCESS,
    ACTION_ADD_SCANNED_DONATION_FAILURE,
    ACTION_REMOVE_SCANNED_DONATION,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS,
    ACTION_REMOVE_DONATION_FROM_POOL_SUCCESS,
    ACTION_POOL_SCANNER_SAVE_CHANGES_REQUEST,
    ACTION_POOL_SCANNER_SAVE_CHANGES_SUCCESS,
    ACTION_POOL_SCANNER_SAVE_CHANGES_FAILURE
} from '../actions/poolScanningActions'
import {objectWith} from './util'

export const poolScanner = (state = {noChanges: true}, action) => {
    const {type, message, error} = action;
    if (type === ACTION_POOL_SCANNER_SAVE_CHANGES_REQUEST) {
        return objectWith(state, {isSaving: true, message, error:undefined})
    } else if (type === ACTION_POOL_SCANNER_SAVE_CHANGES_SUCCESS) {
        return objectWith(state, {noChanges: true, isSaving: false, message, error:undefined})
    } else if (type === ACTION_POOL_SCANNER_SAVE_CHANGES_FAILURE) {
        return objectWith(state, {error, isSaving: false})
    } else if (type === ACTION_ADD_SCANNED_DONATION_SUCCESS || type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS) {
        return objectWith(state, {noChanges: false, message: undefined, error: undefined})
    }
    return state;
};

const updateConfig = (state, newConfig, allowedFields) => {
    if (!newConfig) return state;
    const changes = {};
    Object.keys(newConfig)
        .filter(key => allowedFields.find(f => f === key))
        .forEach(key => changes[key] = newConfig[key]);
    return objectWith(state, changes);
};

const updateConfigForceOverride = (state, newConfig, allowedFields) => {
    const newState = objectWith(state);
    allowedFields.forEach(key => newState[key] = newConfig && newConfig[key]);
    return newState;
};

const configFieldNames = ['productBatch', 'poolNumber', 'bloodInvoice', 'bloodInvoiceSeries', 'totalAmountLimit'];

export const poolScanningConfigs = (state = {poolNumber: 1, totalAmountLimit: 5000, scannedDonations: {}, managingPools:{}}, action) => {
    const {type} = action;
    if (type === ACTION_CHANGE_SCANNING_CONFIG) {
        return updateConfig(state, action, configFieldNames);
    }
    return state;
};

const errorFieldNames = [
    'productBatchError', 'poolNumberError', 'bloodInvoiceError', 'bloodInvoiceSeriesError', 'totalAmountLimitError',
    'scannedTextError', 'scannedDonationError'
];
const setScanErrors = (state, errors, forceOverride) => forceOverride
    ? updateConfigForceOverride(state, errors, errorFieldNames) : updateConfig(state, errors, errorFieldNames);

export const poolScanningErrors = (state = {}, action) => {
    const {type, error, forceOverride} = action;
    if (type === ACTION_SET_SCANNING_ERRORS) {
        return setScanErrors(state, action, forceOverride);
    } else if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE) {
        return setScanErrors(state, {scannedDonationError: error}, true)
    } else if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST) {
        return setScanErrors(state, {scannedDonationError: undefined})
    }
    return state;
};

const scannedDonationWith = (state, externalId, changes) => {
    const donation = Object.assign({externalId}, state[externalId], {timestamp: Date.now()}, changes);
    return objectWith(state, {[externalId]: donation});
};

const removeScannedDonation = (state, externalId) => {
    const newState = objectWith(state);
    delete newState[externalId];
    return newState;
};

export const scannedDonations = (state = {}, action) => {
    const {type, externalId, donationId, changes, bloodDonation} = action;
    if (type === ACTION_ADD_SCANNED_DONATION_REQUEST) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: true, isFetched: false}));
    } else if (type === ACTION_ADD_SCANNED_DONATION_SUCCESS) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: false, isFetched: true}));
    } else if (type === ACTION_ADD_SCANNED_DONATION_FAILURE) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: false, isFetched: false}));
    } else if (type === ACTION_REMOVE_SCANNED_DONATION) {
        return removeScannedDonation(state, externalId);
    } else if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS) {
        return scannedDonationWith(state, donationId, {isAssignedToPool: true});
    } else if (type === ACTION_REMOVE_DONATION_FROM_POOL_SUCCESS) {
        return scannedDonationWith(state, donationId, objectWith(bloodDonation, {isAssignedToPool: false}));
    }
    return state;
};

const RECENT_POOLS_COUNT = 10;

const addScannedPool = (state, externalId, poolChanges) => {
    const pool = Object.assign({}, state[externalId], poolChanges, {externalId, timestamp: Date.now()});
    return [pool, ...Object.keys(state).filter(key => key !== externalId).map(key => state[key])]
        .sort((p1, p2) => p2.timestamp - p1.timestamp).slice(0, RECENT_POOLS_COUNT)
        .reduce((acc, pool) => Object.assign(acc, {[pool.externalId] : pool}), {});
};

export const scannedPools = (state = {}, action) => {
    const {type, externalId, localId, totalAmount} = action;
    if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS) {
        return addScannedPool(state, externalId, {localId, totalAmount});
    }
    return state;
};