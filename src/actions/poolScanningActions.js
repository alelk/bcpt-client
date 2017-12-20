/**
 * Pool Scanning Actions
 *
 * Created by Alex Elkin on 13.12.2017.
 */

import {getOrCreateTableRow, tableRowChangeOnFeature, resetTableRowChanges, getOrFetchTableRow} from './actions'
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

export const addScannedDonationAndAssignToPool = (externalId, changes) => (dispatch, getState) => {
    dispatch(addScannedDonation(externalId, changes)).then(() => {
        const {poolScanningConfigs} = getState();
        const {productBatch, poolNumber} = poolScanningConfigs;
        dispatch(assignScannedDonationToPool(externalId, productBatch, poolNumber));
    })
};

export const ACTION_REMOVE_SCANNED_DONATION = "ACTION_REMOVE_SCANNED_DONATION";

export const removeScannedDonation = (localId) => (dispatch, getState) => {
    const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], localId);
    dispatch(resetTableRowChanges("bloodDonations", bloodDonation && bloodDonation.localId));
    dispatch(Object.assign({type: ACTION_REMOVE_SCANNED_DONATION}, bloodDonation))
};

const initBloodPool = (poolId, changes) => dispatch => new Promise((resolve, reject) => {
    dispatch(
        getOrCreateTableRow("bloodPools", poolId, changes)
    ).then(tableRow => {
        const {bloodDonations} = tableRow;
        if (Array.isArray(bloodDonations) && bloodDonations.length > 0)
            Promise.all(
                bloodDonations.map(bloodDonationId => dispatch(getOrFetchTableRow("bloodDonations", bloodDonationId)))
            ).then(() => {
                resolve(tableRow);
            },  error => {
                reject(error);
            });
        else resolve(tableRow);

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
        const errorPrefix = `Невозможно назначить донацию '${externalId}' в пул '${poolId}': `;
        let error = undefined;
        if (!amount || amount <= 0 || amount > totalAmountLimit || !donationId || /^\s*$/.test(donationId)
            || !productBatch || /^\s*$/.test(productBatch) || !poolNumber || poolNumber<=0) {
            error = `${errorPrefix}один из параметров имеет неверное значение: ID загрузки = ${productBatch}, номер пула = ${poolNumber} объем = ${amount}`;
        } else {
            dispatch(initBloodPool(poolId, {productBatch, poolNumber})).then(() => {
                const bloodPool = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodPools"], poolId);
                if (!bloodPool) {
                    error = `${errorPrefix}возникла непредвиденная ошибка при инициализации пула`;
                } else {
                    let {bloodDonations} = bloodPool;
                    const totalPoolAmount = dispatch(calculateTotalAmount(bloodDonations));
                    if (totalPoolAmount == null) {
                        error = `${errorPrefix}невозможно вычислить текущий суммарный объём пула. Возможно не указан объем для одной из донаций пула.`;
                    } else if (totalPoolAmount + amount > totalAmountLimit) {
                        error = `${errorPrefix}пул переполнен: суммарный объём: ${totalPoolAmount + amount} ограничение: ${totalAmountLimit}`;
                    } else if (bloodDonations && bloodDonations.find(id => id === externalId)) {
                        resolve(bloodPool);
                        dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS, donationId: externalId, poolId});
                    } else {
                        bloodDonations = [externalId, ...(bloodDonations || [])];
                        dispatch(
                            tableRowChangeOnFeature("bloodPools", bloodPool.localId, {bloodDonations, totalAmount: totalPoolAmount + amount})
                        ).then(() => {
                            resolve(bloodPool);
                            dispatch(Object.assign({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_SUCCESS, donationId: externalId, poolId}, bloodPool));
                        }, e => {
                            error = `${errorPrefix}непредвиденная ошибка записи изменений в пул: ${e}`;
                            dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error});
                            reject({donationId:externalId, poolId, error});
                        })
                    }
                }
                if (error) {
                    dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error});
                    reject({donationId:externalId, poolId, error});
                }
            }, e => {
                error = `${errorPrefix}непредвиденная ошибка при инициализации пула: ${e}`;
                dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error});
                reject({donationId:externalId, poolId, error});
            });
        }
        if (error) {
            dispatch({type: ACTION_ASSIGN_SCANNED_DONATION_TO_POOL_FAILURE, donationId: externalId, poolId, error});
            reject({donationId:externalId, poolId, error});
        }
    });
};

const calculateTotalAmount = (bloodDonationIds) => (dispatch, getState) => {
    if (!bloodDonationIds || bloodDonationIds.length === 0) return 0;
    if (!Array.isArray(bloodDonationIds)) return null;
    return bloodDonationIds.map(bloodDonationId =>
         getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], bloodDonationId)
    ).map(bd => bd && bd.amount).reduce((acc, amount) => acc != null && amount != null ? acc + amount : null, 0);
};

export const ACTION_REMOVE_DONATION_FROM_POOL_REQUEST = "ACTION_REMOVE_DONATION_FROM_POOL_REQUEST";
export const ACTION_REMOVE_DONATION_FROM_POOL_SUCCESS = "ACTION_REMOVE_DONATION_FROM_POOL_REQUEST";
export const ACTION_REMOVE_DONATION_FROM_POOL_FAILURE = "ACTION_REMOVE_DONATION_FROM_POOL_FAILURE";

export const removeDonationFromPool = (donationId, productBatch, poolNumber) => (dispatch, getState) => {
    const poolId = productBatch + "-" + poolNumber;
    const bloodDonation = getTableRowByLocalIdOrExternalId(getState().tableItems["bloodDonations"], donationId);
    const bloodPool = productBatch && poolNumber ? getTableRowByLocalIdOrExternalId(getState().tableItems["bloodPools"], poolId) : undefined;
    const dispatchAction = (type, data) => dispatch(
        Object.assign({
            type, donationId: bloodDonation ? bloodDonation.externalId : donationId, productBatch, poolNumber, poolId
        }, data)
    );
    dispatchAction(ACTION_REMOVE_DONATION_FROM_POOL_REQUEST);
    const error = `Невозможно удалить донацию ${donationId} из пула ${poolId}: `;
    if (!bloodDonation || !bloodPool) {
        dispatchAction(
            ACTION_REMOVE_DONATION_FROM_POOL_FAILURE,
            {error: `${error} ${!bloodDonation ? 'донация не найдена' : !bloodPool ? 'пул не найден' : ''}`}
        );
    }
    dispatch(tableRowChangeOnFeature("bloodDonations", bloodDonation.localId, {bloodPool: undefined}))
        .then(() => {
            const bloodDonations = (bloodPool.bloodDonations || []).filter(id => id !== bloodDonation.externalId);
            const totalAmount = dispatch(calculateTotalAmount(bloodDonations));
            dispatch(tableRowChangeOnFeature("bloodPools", bloodPool.localId, {bloodDonations, totalAmount})).then(() => {
                dispatchAction(ACTION_REMOVE_DONATION_FROM_POOL_SUCCESS, {bloodDonation});
            }, error => {
                dispatchAction(
                    ACTION_REMOVE_DONATION_FROM_POOL_FAILURE,
                    {error: `${error}непредвиденная ошибка: ${error}`}
                );
            });
        }, error => {
            dispatchAction(ACTION_REMOVE_DONATION_FROM_POOL_FAILURE, {error: `${error}непредвиденная ошибка: ${error}`});
        });
};