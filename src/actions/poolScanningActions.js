/**
 * Pool Scanning Actions
 *
 * Created by Alex Elkin on 13.12.2017.
 */

import {getOrCreateTableRow, tableRowChangeOnFeature} from './actions'
import {getTableRowByLocalIdOrExternalId} from './utils'

export const ACTION_CHANGE_SCANNING_PROPS = "ACTION_CHANGE_SCANNING_PROPS";

export const changeScanningProps = (changes) => {
    return {type: ACTION_CHANGE_SCANNING_PROPS, ...changes};
};

export const ACTION_ADD_SCANNED_DONATION = "ACTION_ADD_SCANNED_DONATION";

export const addScannedDonation = (externalId, changes) => (dispatch, getState) => {
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
            return dispatch(changeScanningProps({
                productBatchError: productBatch ? undefined : "Введите ID загрузки",
                poolNumberError: poolNumber && poolNumber > 0 ? undefined : "Неверный номер",
                scannedTextError: "Для добавления в пул, требуется указать ID загрузки и номер пула."
            }));
        }
        dispatch(assignScannedDonationToPool(externalId, productBatch, poolNumber));
    });

};

export const initBloodInvoice = (invoiceId, changes) => (dispatch) => {
    console.log("Init blood Invoice", invoiceId, changes);
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
    const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], donationId);
    const amount = bloodDonation && bloodDonation.amount;
    const externalId = bloodDonation && bloodDonation.externalId;
    dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_REQUEST, donationId : externalId, poolId});
    return new Promise((resolve, reject) => {
        if (!amount || amount <= 0) {
            dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error: "Объём донации - положительное число"});
            return reject({donationId, poolId});
        }
        dispatch(
            getOrCreateTableRow("bloodPools", poolId, {poolNumber, productBatch})
        ).then(() => {
            dispatch(
                tableRowChangeOnFeature("bloodDonations", bloodDonation.localId, {bloodPool: poolId})
            ).then(
                () => dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS, donationId: externalId, poolId})
            );
        });
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