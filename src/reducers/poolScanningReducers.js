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

    ACTION_REMOVE_DONATION_FROM_POOL,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS,

} from '../actions/poolScanningActions'
import {objectWith} from './util'

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

/*
const assignDonationToPool = (state, donationId, poolId) => {
    let {managingPools} = state;
    const donations = managingPools[poolId] && managingPools[poolId].donations
        ? [donationId, ...managingPools[poolId].donations.filter(id => id !== donationId)] : [donationId];
    managingPools = objectWith(managingPools, {[poolId]: {externalId: poolId, timestamp: Date.now(), donations}});
    return Object.assign({}, removeScannedDonation(state, donationId), {managingPools, scannedTextError: undefined});
};

const removeDonationFromPool = (state, donationId, poolId) => {
    let {managingPools} = state;
    if (!managingPools[poolId] || !managingPools[poolId].donations) return state;
    const donations = managingPools[poolId].donations.filter(id => id !== donationId);
    const pool = objectWith(managingPools[poolId], {timestamp: Date.now(), donations});
    managingPools = objectWith(managingPools, {[poolId]: pool});
    return Object.assign({}, addScannedDonation(state, donationId, true), {managingPools, scannedTextError: undefined});
}; */

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
    const {type, externalId, changes} = action;
    if (type === ACTION_ADD_SCANNED_DONATION_REQUEST) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: true, isFetched: false}));
    } else if (type === ACTION_ADD_SCANNED_DONATION_SUCCESS) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: false, isFetched: true}));
    } else if (type === ACTION_ADD_SCANNED_DONATION_FAILURE) {
        return scannedDonationWith(state, externalId, objectWith(changes, {isFetching: false, isFetched: false}));
    } else if (type === ACTION_REMOVE_SCANNED_DONATION) {
        return removeScannedDonation(state, externalId);
    }
    return state;
};