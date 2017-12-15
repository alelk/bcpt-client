/**
 * Pool Scanning Reducers
 *
 * Created by Alex Elkin on 13.12.2017.
 */

import {
    ACTION_CHANGE_SCANNING_PROPS,
    ACTION_ADD_SCANNED_DONATION,
    ACTION_REMOVE_DONATION_FROM_POOL,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS,
    ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE
} from '../actions/poolScanningActions'
import {objectWith} from './util'

const updateConfig = (state, configChanges) => {
    const {
        productBatch, poolNumber, bloodInvoice, bloodInvoiceSeries, totalAmountLimit,
        productBatchError, poolNumberError, bloodInvoiceError, bloodInvoiceSeriesError, totalAmountLimitError,
        scannedTextError
    } = configChanges;
    const changes = {
        productBatchError, poolNumberError, bloodInvoiceError,
        bloodInvoiceSeriesError, totalAmountLimitError, scannedTextError
    };
    if (productBatch) Object.assign(changes, {productBatch});
    if (poolNumber) Object.assign(changes, {poolNumber});
    if (bloodInvoice) Object.assign(changes, {bloodInvoice});
    if (bloodInvoiceSeries) Object.assign(changes, {bloodInvoiceSeries});
    if (totalAmountLimit) Object.assign(changes, {totalAmountLimit});
    return objectWith(state, changes);
};

const addScannedDonation = (state, externalId, force) => {
    let {scannedDonations} = state;
    if (scannedDonations[externalId] && !force)
        return updateConfig(state, {scannedTextError: "Пакет с плазмой " + externalId + " уже был просканирован."});
    scannedDonations = objectWith(scannedDonations, {[externalId]: {externalId, isPreparing:true, timestamp: Date.now()}});
    return Object.assign({}, state, {scannedDonations, scannedTextError: undefined});
};

const removeScannedDonation = (state, externalId) => {
    let {scannedDonations} = state;
    const donation = scannedDonations && scannedDonations[externalId];
    if (!donation) return state;
    scannedDonations = objectWith(
        scannedDonations,
        {[externalId]: objectWith(donation, {externalId, isPreparing: false, timestamp: Date.now()})}
    );
    return Object.assign({}, state, {scannedDonations, scannedTextError: undefined});
};

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
};

export const poolScanning = (state = {poolNumber: 1, totalAmountLimit: 5000, scannedDonations: {}, managingPools:{}}, action) => {
    const {type, externalId, error, donationId, poolId} = action;
    if (type === ACTION_CHANGE_SCANNING_PROPS) {
        return updateConfig(state, action);
    } else if (type === ACTION_ADD_SCANNED_DONATION) {
        return addScannedDonation(state, externalId);
    } else if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS) {
        return assignDonationToPool(state, donationId, poolId);
    } else if (type === ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE) {
        return updateConfig(state, {scannedTextError: error})
    } else if (type === ACTION_REMOVE_DONATION_FROM_POOL) {
        return removeDonationFromPool(state, donationId, poolId)
    }
    return state;
};