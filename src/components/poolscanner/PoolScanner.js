/**
 * Pool Scanner
 *
 * Created by Alex Elkin on 15.12.2017.
 */

import AppPage from '../AppPage'
import PoolScannerConfigs from './PoolScannerConfigs'
import DonationScanningField from './DonationsScanningField'

import BloodPool from './BloodPool'
import BloodDonation from './BloodDonation'

import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class PoolScanner extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNewBloodDonation = this.onNewBloodDonation.bind(this);
        this.deleteFromPool = this.deleteFromPool.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.deleteBloodDonation = this.deleteBloodDonation.bind(this);
        this.onAddBloodDonationToPool = this.onAddBloodDonationToPool.bind(this);
        this.state = {
            bloodDonationIds: "",
            bloodPools: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bloodDonations && nextProps.bloodDonations !== this.props.bloodDonations) {
            const bloodDonationIds = this.state.bloodDonationIds.split(/\s+/).filter(v => /^\w+$/.test(v));
            bloodDonationIds.forEach(externalId => {
                const bloodDonation = nextProps.bloodDonations.find(bd => bd.externalId === externalId);
                if (!bloodDonation) return;
                this.addToBloodDonations(bloodDonation);
            });
        }
    }

    onNewBloodDonation(externalId, amount) {
        const {onNewDonationScanned} = this.props;
        onNewDonationScanned && onNewDonationScanned(externalId, {amount});
    }

    addToBloodDonations(bloodDonation) {
        if (!bloodDonation || !bloodDonation.externalId) return;
        const errors = {};
        const hasErrors = !PoolScanner.setErrorMessages(this.state, errors);
        if (hasErrors) return this.setState(errors);
        const {addedBloodDonationIds, bloodInvoiceId, bloodDonationIds, bloodInvoiceSeriesId} = this.state;
        let {addedBloodInvoices} = this.state;
        if (!addedBloodDonationIds.find(id => id === bloodDonation.externalId))
            addedBloodDonationIds.push(bloodDonation.externalId);
        if (!addedBloodInvoices.find(bi => bi.bloodInvoiceId === bloodInvoiceId && bi.bloodInvoiceSeriesId === bloodInvoiceSeriesId)) {
            addedBloodInvoices = addedBloodInvoices.filter(bi => bi.bloodInvoiceId !== bloodInvoiceId);
            addedBloodInvoices.push({bloodInvoiceId, bloodInvoiceSeriesId});
            this.props.requestBloodInvoice(
                bloodInvoiceId,
                bloodInvoiceSeriesId && /\s*[\w\d]+\s*/.test(bloodInvoiceSeriesId)
                    ? {bloodInvoiceSeries: bloodInvoiceSeriesId} : undefined
            );
        }
        this.setState({
            addedBloodDonationIds,
            addedBloodInvoices,
            bloodDonationIds: bloodDonationIds.replace(new RegExp(bloodDonation.externalId + "\\s+\\d{2,4}\\s+", "g"), "\t").replace(/^\s+/, '')
        });
    }

    deleteBloodDonation(localId, bloodDonation) {
        const {resetBloodDonationChanges} = this.props;
        const {addedBloodDonationIds} = this.state;
        this.setState({addedBloodDonationIds : addedBloodDonationIds.filter(id => id !== bloodDonation.externalId)});

        resetBloodDonationChanges && resetBloodDonationChanges(localId);
    }

    onAddBloodDonationToPool(localId) {
        const {poolScannerConfig, onAssignDonationToPool} = this.props;
        const {productBatch, poolNumber} = poolScannerConfig;
        if (onAssignDonationToPool) onAssignDonationToPool(localId, productBatch, poolNumber);
    }

    deleteFromPool(bloodDonationId, poolNumber, productBatchId) {
        const {removeDonationFromPool} = this.props;
        if (removeDonationFromPool) removeDonationFromPool(bloodDonationId, productBatchId, poolNumber);
    }

    bloodPoolTotalAmount(bloodPool) {
        return Object.keys(bloodPool.bloodDonations).map(localId => bloodPool.bloodDonations[localId])
            .reduce((accumulator, bd) => accumulator + parseInt(bd.amount, 10), 0);
    }

    static setErrorMessages(state, changes) {
        const errorMsg = "Требуется ввести значение";
        const newState = Object.assign({}, state, changes);
        let result = true;
        if (newState.bloodInvoiceId === undefined) {
            changes.bloodInvoiceIdError = errorMsg;
            result = false;
        }
        if (newState.productBatchId === undefined) {
            changes.productBatchIdError = errorMsg;
            result = false;
        }
        return result;
    }

    static resetErrorMessages() {
        return {
            bloodInvoiceIdError: undefined,
            productBatchIdError: undefined,
        }
    }

    onSubmit() {
        const {onSubmit, changeBloodDonation} = this.props;
        const {productBatchId, bloodPools} = this.state;
        if (!productBatchId || /^\s+$/.test(productBatchId)) {
            this.setState({productBatchIdError: "Введите номер загрузки."});
            return;
        }
        Object.keys(bloodPools).forEach(poolNumber => {
            const externalId = productBatchId + "-" + poolNumber;
            const {bloodDonations} = bloodPools[poolNumber];
            Object.keys(bloodDonations).map(key => bloodDonations[key]).forEach(bd => changeBloodDonation && changeBloodDonation(bd.localId, {bloodPool: externalId}));
        });
        onSubmit && onSubmit();
        this.setState({
            bloodDonationIds: "",
            bloodPools: {},
            addedBloodDonationIds : [],
            ...PoolScanner.resetErrorMessages()
        });
    }

    onCloseDialog() {
        const {onCancel} = this.props;
        this.setState({
            bloodDonationIds: "",
            bloodPools: {},
            addedBloodDonationIds : [],
            ...PoolScanner.resetErrorMessages()
        });
        onCancel && onCancel();
    }

    renderBloodPools() {
        const {bloodPools, poolScanning} = this.props;
        const {managingPools, productBatch, totalAmountLimit} = poolScanning;
        const managingPoolItems = Object.keys(managingPools)
            .map(externalId => managingPools[externalId])
            .sort((p1, p2) => p2.timestamp - p1.timestamp)
            .map(pool => ({
                ...pool,
                ...this.totalAmountAndDonations(pool)
            })).map(pool => {
                const bloodPool = bloodPools.find(bp => bp.externalId === pool.externalId);
                return {
                    ...pool,
                    poolNumber: bloodPool && bloodPool.poolNumber,
                    totalAmount: pool.totalAmount + (bloodPool && bloodPool.totalAmount ? bloodPool.totalAmount : 0)
                }
            });
        console.log("managingPools: ", managingPoolItems, managingPools);
        return managingPoolItems.map(pool =>
            <BloodPool key={pool.externalId}
                       bloodPool={pool}
                       productBatchId={productBatch}
                       totalAmountLimit={totalAmountLimit}
                       onDeleteBloodDonation={this.deleteFromPool}/>
        )
    }

    totalAmountAndDonations(pool) {
        const {bloodDonations} = this.props;
        const {donations} = pool;
        return donations.reduce((acc, id) => {
            const donation = bloodDonations && bloodDonations.find(d => d.externalId === id);
            return {
                totalAmount: acc.totalAmount + (donation ? donation.amount | 0 : 0),
                bloodDonations : Object.assign(acc.bloodDonations, donation ? {[id] : donation} : undefined)
            };
        }, {totalAmount : 0, bloodDonations : {}});
    }

    renderScannedDonations() {
        const {scannedDonations, poolScannerConfig, onChangeBloodDonation, onRemoveScannedDonation} = this.props;
        return scannedDonations ? (
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {scannedDonations.filter(sd => !sd.isAssignedToPool).map(bd =>
                        <BloodDonation key={bd.localId}
                                       bloodDonation={bd}
                                       poolNumber={poolScannerConfig.poolNumber}
                                       onApply={this.onAddBloodDonationToPool}
                                       onDeleteBloodDonation={localId => onRemoveScannedDonation(localId)}
                                       onChangeBloodDonation={onChangeBloodDonation}/>
                    )}
                </div>
            ) : undefined;
    }

    render() {
        const {
            poolScannerConfig, poolScannerErrors, onScannerConfigChange, onDrawerChangeDrawerVisibilityRequest
        } = this.props;

        return (
            <AppPage className="PoolScanner"
                     title="Сканирование пакетов с плазмой"
                     onDrawerChangeDrawerVisibilityRequest={onDrawerChangeDrawerVisibilityRequest}
                     iconElementRight={<FlatButton label="Применить" onClick={this.onSubmit}/>}
            >
                <Card>
                    <CardText>
                        <PoolScannerConfigs config={poolScannerConfig}
                                            errors={poolScannerErrors}
                                            onChange={onScannerConfigChange}/>
                        <DonationScanningField onNewBloodDonation={this.onNewBloodDonation}/>
                        {poolScannerErrors && poolScannerErrors.scannedDonationError &&
                        <div><label style={{color:'red'}}>{poolScannerErrors.scannedDonationError}</label></div>
                        }
                        {this.renderScannedDonations()}
                    </CardText>
                </Card>
            </AppPage>
        )
    }
}

/*
 <div style={{display:'flex', flexWrap:'wrap'}}>
 {scannedDonationItems.map(bd =>
 <BloodDonation key={bd.localId}
 bloodDonation={bd}
 productBatchId={productBatch}
 onApply={this.onAddBloodDonationToPool}
 onDeleteBloodDonation={this.deleteBloodDonation}
 onChangeBloodDonation={changeBloodDonation}/>
 )}
 </div>
 {this.renderBloodPools()}
 */

export const bloodDonationType = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    donor : PropTypes.string,
    bloodInvoice : PropTypes.string,
    bloodPool : PropTypes.string,
    donationType : PropTypes.string,
    amount : PropTypes.number,
    donationDate : PropTypes.string,
    quarantineDate : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
export const poolScannerConfigType = PropTypes.shape({
    productBatch: PropTypes.string,
    bloodInvoiceSeries : PropTypes.string,
    bloodInvoice: PropTypes.string,
    poolNumber: PropTypes.number,
    totalAmountLimit: PropTypes.number
});
export const poolScannerErrorType = PropTypes.shape({
    productBatchError: PropTypes.string,
    bloodInvoiceSeriesError: PropTypes.string,
    bloodInvoiceError: PropTypes.string,
    poolNumberError: PropTypes.string,
    totalAmountLimitError: PropTypes.string,
    scannedDonationError: PropTypes.string,
});
PoolScanner.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    poolScannerConfig: poolScannerConfigType.isRequired,
    poolScannerErrors: poolScannerErrorType.isRequired,
    onScannerConfigChange: PropTypes.func,
    onNewDonationScanned: PropTypes.func,
    onRemoveScannedDonation: PropTypes.func,
    onChangeBloodDonation: PropTypes.func,
    onAssignDonationToPool: PropTypes.func,
    scannedDonations:PropTypes.arrayOf(PropTypes.shape({
        localId : PropTypes.string,
        externalId : PropTypes.string,
        bloodInvoice : PropTypes.string,
        bloodPool : PropTypes.string,
        amount : PropTypes.number,
        timestamp : PropTypes.number,
    })),



    bloodDonations : PropTypes.arrayOf(bloodDonationType),


    open: PropTypes.bool,
    poolScanning: PropTypes.object.isRequired,
    requestBloodDonation: PropTypes.func,
    resetBloodDonationChanges: PropTypes.func,
    changeBloodDonation: PropTypes.func,
    requestBloodInvoice: PropTypes.func,
    changeScanningProps: PropTypes.func,
    addScannedDonation: PropTypes.func,
    removeDonationFromPool: PropTypes.func,



    onCancel : PropTypes.func,
    onSubmit : PropTypes.func
};
export default PoolScanner;