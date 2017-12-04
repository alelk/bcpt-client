/**
 * Pool Scanning Dialog
 *
 * Created by Alex Elkin on 28.11.2017.
 */

import {bloodDonationType} from '../BloodDonationsTable'
import BloodPool from './BloodPool'

import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './PoolScanningDialog.css'

class PoolScanningDialog extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onNewBloodDonation = this.onNewBloodDonation.bind(this);
        this.deleteFromPool = this.deleteFromPool.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.state = {
            productBatchId: "",
            currentPoolNumber: 1,
            totalAmountLimit: 5000,
            bloodDonationIds: "",
            bloodPools: {},
            productBatchIdError: undefined
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bloodDonations && nextProps.bloodDonations !== this.props.bloodDonations) {
            const bloodDonationIds = this.state.bloodDonationIds.split(/\s+/).filter(v => /^\w+$/.test(v));
            bloodDonationIds.forEach(localId => {
                const bloodDonation = nextProps.bloodDonations.find(bd => bd.localId === localId);
                if (!bloodDonation) return;
                this.addToPool(bloodDonation);
            });
        }
    }

    addToPool(bloodDonation) {
        const {bloodPools, bloodDonationIds, totalAmountLimit} = this.state;
        let {currentPoolNumber} = this.state;
        let currentPool = bloodPools[currentPoolNumber] || {bloodDonations:{}, poolNumber: currentPoolNumber};
        const totalAmount = this.bloodPoolTotalAmount(currentPool);
        if (totalAmount + bloodDonation.amount < totalAmountLimit) {
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
            bloodDonationIds: bloodDonationIds.replace(bloodDonation.localId, "").replace(/^\s+/, '')
        });
        console.log("Blood pool #" + currentPoolNumber + ": ", currentPool, ", bloodPools: ", bloodPools)
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
            .reduce((accumulator, bd) => accumulator + bd.amount, 0);
    }

    onChange(propName, value) {
        if (/productBatchId|totalAmountLimit|currentPoolNumber/.test(propName))
            this.setState({[propName]: value, productBatchIdError: undefined});
        else if (/bloodDonationIds/.test(propName)) {
            const result = /^\s*(\w+\s+)*(\w+)\s+$/.exec(value);
            const localId = result && result[2];
            this.setState({[propName]: value.replace(/\s+/g, '\t')});
            if (localId) this.onNewBloodDonation(localId);
        }
    }

    onNewBloodDonation(localId) {
        this.props.requestBloodDonation(localId);
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
        const {open} = this.props;
        const {
            productBatchId, currentPoolNumber, bloodDonationIds, totalAmountLimit, bloodPools, productBatchIdError
        } = this.state;
        return (
            <Dialog open={open}
                    className="PoolScanningDialog"
                    actions={[
                        <RaisedButton label="Отмена" onClick={this.onCloseDialog}/>,
                        <RaisedButton primary={true} label="OK" onClick={this.onSubmit}/>
                    ]}
                    onRequestClose={this.onCloseDialog}
                    contentStyle={{width: '95%', maxWidth: '100%'}}
                    autoScrollBodyContent
                    title="Сканирование пулов">
                <TextField hintText="Введите ID загрузки"
                           value={productBatchId}
                           errorText={productBatchIdError}
                           floatingLabelText="ID загрузки"
                           onChange={e => this.onChange('productBatchId', e.target.value)}/>
                <TextField hintText="Введите первый номер пула"
                           type="number"
                           value={currentPoolNumber}
                           floatingLabelText="Начальный номер пула"
                           onChange={
                               e => this.onChange('currentPoolNumber', e.target.value)
                           }/>
                <TextField hintText="Выберите максимальный объем пула"
                           type="number"
                           value={totalAmountLimit}
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
PoolScanningDialog.propTypes = {
    open : PropTypes.bool,
    requestBloodDonation: PropTypes.func,
    bloodDonations : PropTypes.arrayOf(bloodDonationType),
    onCancel : PropTypes.func,
    onSubmit : PropTypes.func
};
export default PoolScanningDialog;