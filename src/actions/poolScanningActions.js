/**
 * Pool Scanning Actions
 *
 * Created by Alex Elkin on 13.12.2017.
 */

import {getOrCreateTableRow, tableRowChangeOnFeature, resetTableRowChanges} from './actions'
import {getTableRowByLocalIdOrExternalId} from './utils'

export const ACTION_CHANGE_SCANNING_CONFIG = "ACTION_CHANGE_SCANNING_CONFIG";

export const changeScanningConfig = (changes) => ({type: ACTION_CHANGE_SCANNING_CONFIG, ...changes});

export const ACTION_SET_SCANNING_ERRORS = "ACTION_SET_SCANNING_ERRORS";

export const setScanningErrors = (errors) => ({type: ACTION_SET_SCANNING_ERRORS, ...errors});

export const ACTION_ADD_SCANNED_DONATION_REQUEST = "ACTION_ADD_SCANNED_DONATION_REQUEST";
export const ACTION_ADD_SCANNED_DONATION_SUCCESS = "ACTION_ADD_SCANNED_DONATION_SUCCESS";
export const ACTION_ADD_SCANNED_DONATION_FAILURE = "ACTION_ADD_SCANNED_DONATION_FAILURE";

const addScannedDonationWith = (type, externalId, config, changes) => {
    const {productBatch, poolNumber, bloodInvoice, bloodInvoiceSeries} = config || {};
    return {type, externalId, changes: Object.assign({productBatch, poolNumber, bloodInvoice, bloodInvoiceSeries}, changes)}
};

export const addScannedDonation = (externalId, changes) => (dispatch, getState) => {
    const {poolScanningConfigs} = getState();
    const donationConfig = Object.assign(poolScanningConfigs, changes);
    const {bloodInvoice, bloodInvoiceSeries} = donationConfig;
    dispatch(addScannedDonationWith(ACTION_ADD_SCANNED_DONATION_REQUEST, externalId, donationConfig));
    return new Promise((resolve, reject) => {
        dispatch(initBloodDonation(
            externalId,
            Object.assign({}, changes, bloodInvoice ? {bloodInvoice} : undefined),
            bloodInvoiceSeries ? {bloodInvoiceSeries} : undefined
        )).then(() => {
            const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], externalId);
            resolve(bloodDonation);
            dispatch(addScannedDonationWith(ACTION_ADD_SCANNED_DONATION_SUCCESS, externalId, donationConfig, bloodDonation));
        }, error => {
            reject(error);
            dispatch(addScannedDonationWith(ACTION_ADD_SCANNED_DONATION_FAILURE, externalId, donationConfig));
        });
    });
};

export const ACTION_REMOVE_SCANNED_DONATION = "ACTION_REMOVE_SCANNED_DONATION";

export const removeScannedDonation = (localId) => (dispatch, getState) => {
    const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], localId);
    dispatch(resetTableRowChanges("bloodDonations", bloodDonation && bloodDonation.localId));
    dispatch(Object.assign({type: ACTION_REMOVE_SCANNED_DONATION}, bloodDonation))
};

/*
export const addScannedDonationAndAssignToPool = (externalId, changes) => (dispatch, getState) => {
    const {productBatch, poolNumber, bloodInvoice, bloodInvoiceSeries} = getState().poolScanning;
    dispatch({
        type: ACTION_ADD_SCANNED_DONATION,
        externalId,
        productBatch,
        poolNumber
    });
    if (bloodInvoice) dispatch(initBloodInvoice(bloodInvoice, bloodInvoiceSeries ? {bloodInvoiceSeries} : undefined));
    const donationChanges = Object.assign({}, changes, bloodInvoice ? {bloodInvoice} : undefined);
    dispatch(
        getOrCreateTableRow("bloodDonations", externalId, donationChanges)
    ).then(() => {
        if (!productBatch || !poolNumber || poolNumber <= 0) {
            return dispatch(changeScanningConfig({
                productBatchError: productBatch ? undefined : "Введите ID загрузки",
                poolNumberError: poolNumber && poolNumber > 0 ? undefined : "Неверный номер",
                scannedTextError: "Для добавления в пул, требуется указать ID загрузки и номер пула."
            }));
        }
        dispatch(assignScannedDonationToPool(externalId, productBatch, poolNumber));
    });

}; */

const initBloodPool = (poolId, changes) => dispatch => new Promise((resolve, reject) => {
    dispatch(
        getOrCreateTableRow("bloodPools", poolId, changes)
    ).then(tableRow => {
        console.log("BloodPool: ", tableRow);
        resolve(tableRow);
    }, error => reject(error));
});

export const initBloodDonation = (donationId, changes, bloodInvoiceChanges) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch(
            getOrCreateTableRow("bloodDonations", donationId, changes)
        ).then(tableRow => {
            const bloodInvoice = changes && changes.bloodInvoice;
            if (bloodInvoice)
                return dispatch(initBloodInvoice(bloodInvoice, bloodInvoiceChanges))
                    .then(() => resolve(tableRow), () => reject(tableRow));
            else resolve(tableRow)
        }, error => reject(error))
    });
};

export const initBloodInvoice = (invoiceId, changes) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch(
            getOrCreateTableRow("bloodInvoices", invoiceId, changes)
        ).then(tableRow => {
            const bloodInvoiceSeries = changes && changes.bloodInvoiceSeries;
            if (bloodInvoiceSeries)
                return dispatch(initBloodInvoiceSeries(bloodInvoiceSeries))
                    .then(() => resolve(tableRow), () => reject(tableRow));
            else resolve(tableRow)
        }, error => reject(error))
    });
};

export const initBloodInvoiceSeries = (invoiceSeriesId, changes) => (dispatch) => {
    return dispatch(
        getOrCreateTableRow("bloodInvoiceSeries", invoiceSeriesId, changes)
    );
};

export const ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST = "ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST";
export const ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS = "ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS";
export const ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE = "ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE";

export const assignScannedDonationToPool = (donationId, productBatch, poolNumber) => (dispatch, getState) => {
    const poolId = productBatch + "-" + poolNumber;
    const {totalAmountLimit} = getState().poolScanningConfigs;
    return new Promise((resolve, reject) => {
        const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], donationId);
        const amount = bloodDonation && bloodDonation.amount;
        const externalId = bloodDonation && bloodDonation.externalId;
        dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST, donationId : externalId, poolId});
        if (!amount || amount <= 0 || amount > totalAmountLimit || !donationId || /^\s*$/.test(donationId)
            || !productBatch || /^\s*$/.test(productBatch) || !poolNumber || poolNumber<=0) {
            const error = `Невозможно назначить донацию '${externalId}' в пул '${poolId}': один из параметров имеет неверное значение: ID загрузки = ${productBatch}, номер пула = ${poolNumber} объем = ${amount}`;
            dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error});
            reject({donationId, poolId, error});
        } else {
            dispatch(initBloodPool(poolId, {productBatch, poolNumber}));
            /*
            dispatch(
                getOrCreateTableRow("bloodPools", poolId, {poolNumber, productBatch})
            ).then(() => {
                dispatch(
                    tableRowChangeOnFeature("bloodDonations", bloodDonation.localId, {bloodPool: poolId})
                ).then(
                    () => dispatch({
                        type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS,
                        donationId: externalId,
                        poolId
                    })
                );
            }); */
        }
    });
};

export const ACTION_REMOVE_DONATION_FROM_POOL = "ACTION_REMOVE_DONATION_FROM_POOL";

export const removeDonationFromPool = (donationId, productBatch, poolNumber) => (dispatch, getState) => {
    const poolId = productBatch + "-" + poolNumber;
    const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], donationId);
    if (!bloodDonation) return;
    dispatch({
        type: ACTION_REMOVE_DONATION_FROM_POOL,
        donationId : bloodDonation.externalId,
        poolId
    });
    if (bloodDonation.bloodPool === poolId)
        dispatch(tableRowChangeOnFeature("bloodDonations", bloodDonation.localId, {bloodPool:undefined}));
};