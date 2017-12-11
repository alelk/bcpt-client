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
            bloodInvoiceSeriesId: undefined,
            bloodInvoiceId: undefined,
            productBatchId: undefined,
            currentPoolNumber: 1,
            totalAmountLimit: 5000,
            bloodDonationIds: "",
            requestedBloodDonations: [],
            addedBloodDonationIds: [],
            bloodPools: {},
            bloodInvoiceSeriesIdError: undefined,
            bloodInvoiceIdError: undefined,
            productBatchIdError: undefined
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

    onNewBloodDonation(externalId) {
        const {bloodDonations} = this.props;
        const {requestedBloodDonations} = this.state;
        if (bloodDonations.find(bd => bd.externalId === externalId)
            || requestedBloodDonations.find(id => id === externalId)) return;
        this.props.requestBloodDonation(externalId);
        requestedBloodDonations.push(externalId);
        this.setState({requestedBloodDonations});
    }

    addToBloodDonations(bloodDonation) {
        if (!bloodDonation || !bloodDonation.externalId) return;
        const errors = {};
        const hasErrors = !DonationScanningDialog.setErrorMessages(this.state, errors);
        if (hasErrors) return this.setState(errors);
        const {changeBloodDonation} = this.props;
        const {addedBloodDonationIds, bloodDonationIds, bloodInvoiceId} = this.state;
        if (!addedBloodDonationIds.find(id => id === bloodDonation.externalId))
            addedBloodDonationIds.push(bloodDonation.externalId);
        this.setState({
            addedBloodDonationIds,
            bloodDonationIds: bloodDonationIds.replace(bloodDonation.externalId, "").replace(/^\s+/, '')
        });
        if (!bloodDonation.bloodInvoice && bloodInvoiceId && changeBloodDonation)
            changeBloodDonation(bloodDonation.localId, {bloodInvoice: bloodInvoiceId});
    }

    deleteBloodDonation(localId, bloodDonation) {
        const {resetBloodDonationChanges} = this.props;
        const {addedBloodDonationIds} = this.state;
        this.setState({addedBloodDonationIds : addedBloodDonationIds.filter(id => id !== bloodDonation.externalId)});

        resetBloodDonationChanges && resetBloodDonationChanges(localId);
    }

    onAddBloodDonationToPool(localId, bloodDonation) {
        const {bloodPools, addedBloodDonationIds, totalAmountLimit} = this.state;
        let {currentPoolNumber} = this.state;
        let currentPool = bloodPools[currentPoolNumber] || {bloodDonations:{}, poolNumber: currentPoolNumber};
        const totalAmount = this.bloodPoolTotalAmount(currentPool);
        if (totalAmount + parseInt(bloodDonation.amount, 10) < totalAmountLimit) {
            currentPool.bloodDonations[bloodDonation.localId] = bloodDonation;
        } else {
            currentPoolNumber ++;
            currentPool = {
                bloodDonations:{[bloodDonation.localId]:bloodDonation},
                poolNumber: currentPoolNumber,
            }
        }
        currentPool.totalAmount = this.bloodPoolTotalAmount(currentPool);
        bloodPools[currentPool.poolNumber] = currentPool;
        this.setState({
            bloodPools,
            currentPoolNumber,
            addedBloodDonationIds : addedBloodDonationIds.filter(id => id !== bloodDonation.externalId)
        });
    }

    deleteFromPool(bloodDonationId, poolNumber) {
        let {bloodPools} = this.state;
        const bloodPool = bloodPools[poolNumber];
        const bloodDonations = bloodPool && bloodPool.bloodDonations;
        if (!bloodDonations) return;
        delete bloodDonations[bloodDonationId];
        bloodPool.totalAmount = this.bloodPoolTotalAmount(bloodPool);
        this.setState({bloodPools})
    }

    bloodPoolTotalAmount(bloodPool) {
        return Object.keys(bloodPool.bloodDonations).map(localId => bloodPool.bloodDonations[localId])
            .reduce((accumulator, bd) => accumulator + parseInt(bd.amount, 10), 0);
    }

    onChange(propName, value) {
        if (/bloodInvoiceSeriesId|bloodInvoiceId|productBatchId|totalAmountLimit|currentPoolNumber/.test(propName)) {
            this.setState({[propName]: value, ...DonationScanningDialog.resetErrorMessages()});
        }
        else if (/bloodDonationIds/.test(propName)) {
            const result = /^\s*(\w+\s+)*(\w+)\s+$/.exec(value);
            const localId = result && result[2];
            this.setState({[propName]: value.replace(/\s+/g, '\t')});
            if (localId) this.onNewBloodDonation(localId);
        }
    }

    static setErrorMessages(state, changes) {
        const errorMsg = "Требуется ввести значение";
        const newState = Object.assign({}, state, changes);
        let result = true;
        if (newState.bloodInvoiceSeriesId === undefined) {
            changes.bloodInvoiceSeriesIdError = errorMsg;
            result = false;
        }
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
            bloodInvoiceSeriesIdError: undefined,
            bloodInvoiceIdError: undefined,
            productBatchIdError: undefined
        }
    }

    onSubmit() {
        const {onSubmit} = this.props;
        const {productBatchId, bloodPools} = this.state;
        if (!productBatchId || /^\s+$/.test(productBatchId)) {
            this.setState({productBatchIdError: "Введите номер загрузки."});
            return;
        }
        onSubmit && onSubmit(Object.keys(bloodPools).map(poolNumber => {
            const externalId = productBatchId + "-" + poolNumber;
            const {totalAmount, bloodDonations} = bloodPools[poolNumber];
            return {
                externalId,
                poolNumber,
                productBatch: productBatchId,
                totalAmount,
                bloodDonations : Object.keys(bloodDonations)
            };
        }));
        this.setState({
            bloodDonationIds: "",
            bloodPools: {},
            productBatchIdError: undefined
        });
    }

    onCloseDialog() {
        const {onCancel} = this.props;
        this.setState({
            bloodDonationIds: "",
            bloodPools: {},
            productBatchIdError: undefined
        });
        onCancel && onCancel();
    }

    render() {
        const {open, changeBloodDonation, bloodDonations} = this.props;
        const {
            bloodInvoiceId, productBatchId, currentPoolNumber, bloodDonationIds, totalAmountLimit, bloodInvoiceSeriesIdError,
            bloodPools, productBatchIdError, bloodInvoiceIdError, addedBloodDonationIds, bloodInvoiceSeriesId
        } = this.state;

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
                           value={productBatchId}
                           errorText={productBatchIdError}
                           floatingLabelText="ID загрузки"
                           style={{width:200}}
                           onChange={e => this.onChange('productBatchId', e.target.value)}/>
                <TextField hintText="Введите серию ПДФ"
                           value={bloodInvoiceSeriesId}
                           errorText={bloodInvoiceSeriesIdError}
                           floatingLabelText="Серия ПДФ"
                           style={{width:200}}
                           onChange={e => this.onChange('bloodInvoiceSeriesId', e.target.value)}/>
                <TextField hintText="Введите ID накладной"
                           value={bloodInvoiceId}
                           errorText={bloodInvoiceIdError}
                           floatingLabelText="ID накладной"
                           style={{width:200}}
                           onChange={e => this.onChange('bloodInvoiceId', e.target.value)}/>
                <TextField hintText="Введите номер"
                           type="number"
                           value={currentPoolNumber}
                           floatingLabelText="Начальный номер пула"
                           style={{width:200}}
                           onChange={
                               e => this.onChange('currentPoolNumber', e.target.value)
                           }/>
                <TextField hintText="Выберите максимальный объём"
                           type="number"
                           value={totalAmountLimit}
                           style={{width:250}}
                           floatingLabelText="Максимальный объем пула, мл."
                           onChange={e => this.onChange('totalAmountLimit', e.target.value)}/>
                <TextField hintText="Сканируйте номера донаций"
                           value={bloodDonationIds}
                           multiLine
                           fullWidth
                           rows={1}
                           rowsMax={20}
                           type="text"
                           floatingLabelText="Номера донаций"
                           onChange={e => this.onChange('bloodDonationIds', e.target.value)}/>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    {addedBloodDonationIds.map(externalId => bloodDonations.find(bd => bd.externalId === externalId))
                        .filter(bd => bd != null)
                        .sort((bd1, bd2) => bd2.creationTimestamp - bd1.creationTimestamp)
                        .map(bd =>
                            <BloodDonation key={bd.localId}
                                           bloodDonation={bd}
                                           productBatchId={productBatchId}
                                           onApply={this.onAddBloodDonationToPool}
                                           onDeleteBloodDonation={this.deleteBloodDonation}
                                           onChangeBloodDonation={changeBloodDonation}/>
                        )}
                </div>

                {Object.keys(bloodPools).sort((a,b) => b-a).map(bloodPoolId =>
                    <BloodPool key={bloodPoolId}
                               bloodPool={bloodPools[bloodPoolId]}
                               productBatchId={productBatchId}
                               totalAmountLimit={parseInt(totalAmountLimit, 10)}
                               onDeleteBloodDonation={this.deleteFromPool}/>
                )}
            </Dialog>
        )
    }
}
DonationScanningDialog.propTypes = {
    open: PropTypes.bool,
    requestBloodDonation: PropTypes.func,
    resetBloodDonationChanges: PropTypes.func,
    changeBloodDonation: PropTypes.func,
    bloodDonations : PropTypes.arrayOf(bloodDonationType),
    onCancel : PropTypes.func,
    onSubmit : PropTypes.func
};
export default DonationScanningDialog;