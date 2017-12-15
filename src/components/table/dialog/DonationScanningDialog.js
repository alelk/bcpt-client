/**
 * Donation Scanning Dialog
 *
 * Created by Alex Elkin on 07.12.2017.
 */

import {bloodDonationType} from '../BloodDonationsTable'
import BloodPool from './BloodPool'
import BloodDonation from './BloodDonation'

import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './PoolScanningDialog.css'

class DonationScanningDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onNewBloodDonation = this.onNewBloodDonation.bind(this);
        this.deleteFromPool = this.deleteFromPool.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.deleteBloodDonation = this.deleteBloodDonation.bind(this);
        this.onAddBloodDonationToPool = this.onAddBloodDonationToPool.bind(this);
        this.state = {
            bloodInvoiceId: undefined,
            bloodInvoiceSeriesId: undefined,
            productBatchId: undefined,
            currentPoolNumber: 1,
            totalAmountLimit: 5000,
            bloodDonationIds: "",
            addedBloodDonationIds: [],
            addedBloodInvoices: [],
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
        const {bloodInvoiceId} = this.state;
        this.props.addScannedDonation(externalId, {bloodInvoice: bloodInvoiceId, amount});
        //this.props.requestBloodDonation(externalId, {bloodInvoice: bloodInvoiceId, amount});
    }

    addToBloodDonations(bloodDonation) {
        if (!bloodDonation || !bloodDonation.externalId) return;
        const errors = {};
        const hasErrors = !DonationScanningDialog.setErrorMessages(this.state, errors);
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

    onAddBloodDonationToPool(localId, bloodDonation) {
        const {poolScanning, assignScannedDonationToPool} = this.props;
        const {productBatch, poolNumber} = poolScanning;
        if (assignScannedDonationToPool) assignScannedDonationToPool(localId, productBatch, poolNumber);
    }

    deleteFromPool(bloodDonationId, poolNumber, productBatchId) {
        const {removeDonationFromPool} = this.props;
        if (removeDonationFromPool) removeDonationFromPool(bloodDonationId, productBatchId, poolNumber);
    }

    bloodPoolTotalAmount(bloodPool) {
        return Object.keys(bloodPool.bloodDonations).map(localId => bloodPool.bloodDonations[localId])
            .reduce((accumulator, bd) => accumulator + parseInt(bd.amount, 10), 0);
    }

    onChange(propName, value) {
        if (/bloodInvoice|bloodInvoiceSeries|productBatch|totalAmountLimit|poolNumber/.test(propName)) {
            this.props.changeScanningProps({[propName]: value});
        }
        else if (/bloodDonationIds/.test(propName)) {
            const result = /^\s*(\w+\s+)*(\w{6,20})\s+(\d{2,4})\s+$/.exec(value);
            const localId = result && result[2];
            const amount = result && result[3];
            if (localId && amount) {
                this.onNewBloodDonation(localId, parseInt(amount, 10));
                this.setState({
                    bloodDonationIds: value.replace(new RegExp(localId + "\\s+" + amount + "\\s+"), "\t").replace(/^\s+/, '')
                });
            } else
                this.setState({[propName]: value.replace(/\s+/g, '\t')});
        }
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
            ...DonationScanningDialog.resetErrorMessages()
        });
    }

    onCloseDialog() {
        const {onCancel} = this.props;
        this.setState({
            bloodDonationIds: "",
            bloodPools: {},
            addedBloodDonationIds : [],
            ...DonationScanningDialog.resetErrorMessages()
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

    render() {
        const {open, changeBloodDonation, bloodDonations, poolScanning} = this.props;
        const {
            productBatch, bloodInvoice, bloodInvoiceSeries, poolNumber, totalAmountLimit,
            productBatchError, poolNumberError, bloodInvoiceError, bloodInvoiceSeriesError, totalAmountLimitError,
            scannedTextError, scannedDonations
        } = poolScanning;
        const {
            bloodDonationIds
        } = this.state;

        const scannedDonationItems = Object.keys(scannedDonations)
            .map(externalId => scannedDonations[externalId])
            .filter(sd => sd.isPreparing)
            .sort((sd1, sd2) => sd2.timestamp - sd1.timestamp)
            .map(donation => bloodDonations.find(bd => bd.externalId === donation.externalId))
            .filter(donation => donation != null);

        return (
            <Dialog open={open}
                    className="PoolScanningDialog"
                    actions={[
                        <RaisedButton label="Отмена" onClick={this.onCloseDialog}/>,
                        <RaisedButton primary={true} label="OK" onClick={this.onSubmit}/>
                    ]}
                    onRequestClose={this.onCloseDialog}
                    contentStyle={{width: '98%', maxWidth: '100%'}}
                    autoScrollBodyContent
                    title="Сканирование пакетов с плазмой">
                <TextField hintText="Введите ID загрузки"
                           value={productBatch}
                           errorText={productBatchError}
                           floatingLabelText="ID загрузки"
                           style={{width:200}}
                           onChange={e => this.onChange('productBatch', e.target.value)}/>
                <TextField hintText="Введите номер ПДФ"
                           errorText={bloodInvoiceSeriesError}
                           value={bloodInvoiceSeries}
                           floatingLabelText="Номер ПДФ"
                           style={{width:200}}
                           onChange={e => this.onChange('bloodInvoiceSeries', e.target.value)}/>
                <TextField hintText="Введите ID накладной"
                           value={bloodInvoice}
                           errorText={bloodInvoiceError}
                           floatingLabelText="ID накладной"
                           style={{width:200}}
                           onChange={e => this.onChange('bloodInvoice', e.target.value)}/>
                <TextField hintText="Введите номер"
                           type="number"
                           errorText={poolNumberError}
                           value={poolNumber}
                           floatingLabelText="Номер пула"
                           style={{width:200}}
                           onChange={
                               e => this.onChange('poolNumber', e.target.value)
                           }/>
                <TextField hintText="Выберите максимальный объём"
                           type="number"
                           errorText={totalAmountLimitError}
                           value={totalAmountLimit}
                           style={{width:250}}
                           floatingLabelText="Максимальный объем пула, мл."
                           onChange={e => this.onChange('totalAmountLimit', e.target.value)}/>
                <TextField hintText="Сканируйте номера донаций"
                           value={bloodDonationIds}
                           errorText={scannedTextError}
                           multiLine
                           fullWidth
                           rows={1}
                           rowsMax={20}
                           type="text"
                           floatingLabelText="Номера донаций"
                           onChange={e => this.onChange('bloodDonationIds', e.target.value)}/>
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
            </Dialog>
        )
    }
}
DonationScanningDialog.propTypes = {
    open: PropTypes.bool,
    poolScanning: PropTypes.object.isRequired,
    requestBloodDonation: PropTypes.func,
    resetBloodDonationChanges: PropTypes.func,
    changeBloodDonation: PropTypes.func,
    requestBloodInvoice: PropTypes.func,
    changeScanningProps: PropTypes.func,
    addScannedDonation: PropTypes.func,
    removeDonationFromPool: PropTypes.func,
    bloodDonations : PropTypes.arrayOf(bloodDonationType),
    onCancel : PropTypes.func,
    onSubmit : PropTypes.func
};
export default DonationScanningDialog;