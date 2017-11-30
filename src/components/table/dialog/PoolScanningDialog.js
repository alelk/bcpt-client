/**
 * Pool Scanning Dialog
 *
 * Created by Alex Elkin on 28.11.2017.
 */

import {bloodDonationType} from '../BloodDonationsTable'

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
        this.state = {
            productBatchId: "",
            poolStartNumber: 1,
            bloodDonations: "",
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bloodDonations && nextProps.bloodDonations !== this.props.bloodDonations) {
            const bloodDonationIds = this.state.bloodDonations.split(/\s+/).filter(v => /^\w+$/.test(v));
            bloodDonationIds.forEach(localId => {
                const bloodDonation = nextProps.bloodDonations.find(bd => bd.localId === localId);
                if (!bloodDonation) return;
                // todo

                this.setState({bloodDonations : this.state.bloodDonations.replace(localId, "").replace(/^\s+/, '')})
            });
        }
    }

    onChange(propName, value) {
        if (/productBatchId|poolStartNumber/.test(propName))
            this.setState({[propName] : value});
        else if (/bloodDonations/.test(propName)) {
            const result = /^\s*(\w+\s+)*(\w+)\s+$/.exec(value);
            const localId = result && result[2];
            this.setState({[propName] : value.replace(/\s+/g, '\t')});
            if (localId) this.onNewBloodDonation(localId);
        }
    }

    onNewBloodDonation(localId) {
        this.props.requestBloodDonation(localId);
    }

    onSubmit() {
    }

    render() {
        const {open, onCancel} = this.props;
        const {productBatchId, poolStartNumber, bloodDonations} = this.state;
        return (
            <Dialog open={open}
                    className="PoolScanningDialog"
                    actions={[
                        <RaisedButton label="Отмена" onClick={onCancel}/>,
                        <RaisedButton primary={true} label="OK" onClick={this.onSubmit}/>
                    ]}
                    onRequestClose={onCancel}
                    contentStyle={{width: '95%', maxWidth: '100%'}}
                    title="Сканирование пулов">
                <TextField hintText="Введите ID загрузки"
                           value={productBatchId}
                           floatingLabelText="ID загрузки"
                           onChange={e => this.onChange('productBatchId', e.target.value)}/>
                <TextField hintText="Введите первый номер пула"
                           type="number"
                           value={poolStartNumber}
                           floatingLabelText="Начальный номер пула"
                           onChange={e => this.onChange('poolStartNumber', e.target.value)}/>
                <TextField hintText="Сканируйте номера донаций"
                           value={bloodDonations}
                           multiLine
                           fullWidth
                           rows={1}
                           rowsMax={20}
                           type="text"
                           floatingLabelText="Номера донаций"
                           onChange={e => this.onChange('bloodDonations', e.target.value)}/>
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