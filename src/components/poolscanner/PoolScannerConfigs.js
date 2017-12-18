/**
 * Pool Scanner Configs
 *
 * Created by Alex Elkin on 15.12.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Rx from 'rxjs/Rx';

class PoolScannerConfigs extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        const {onChange} = this.props;
        if (onChange)
            Rx.Observable.create(o => {
                this.observer = o;
            }).debounceTime(500).subscribe(changes => onChange(changes));
    }

    componentWillUnmount() {
        this.observer && this.observer.complete();
    }

    onChange(fieldName, value) {
        this.changes = Object.assign({}, this.changes, {[fieldName]: value});
        this.observer && this.observer.next(this.changes);
    }

    render() {
        const {config, errors} = this.props;
        const {productBatch, bloodInvoice, bloodInvoiceSeries, poolNumber, totalAmountLimit} = config || {};
        const {productBatchError, poolNumberError, bloodInvoiceError, bloodInvoiceSeriesError, totalAmountLimitError} = errors || {};
        return (
            <div>
                <TextField hintText="Введите ID загрузки"
                           defaultValue={productBatch}
                           errorText={productBatchError}
                           floatingLabelText="ID загрузки"
                           style={{width: 200}}
                           onChange={e => this.onChange('productBatch', e.target.value)}/>
                <TextField hintText="Введите номер ПДФ"
                           errorText={bloodInvoiceSeriesError}
                           defaultValue={bloodInvoiceSeries}
                           floatingLabelText="Номер ПДФ"
                           style={{width: 200}}
                           onChange={e => this.onChange('bloodInvoiceSeries', e.target.value)}/>
                <TextField hintText="Введите ID накладной"
                           defaultValue={bloodInvoice}
                           errorText={bloodInvoiceError}
                           floatingLabelText="ID накладной"
                           style={{width: 200}}
                           onChange={e => this.onChange('bloodInvoice', e.target.value)}/>
                <TextField hintText="Введите номер"
                           type="number"
                           errorText={poolNumberError}
                           defaultValue={poolNumber}
                           floatingLabelText="Номер пула"
                           style={{width: 200}}
                           onChange={e => this.onChange('poolNumber', parseInt(e.target.value, 10))}/>
                <TextField hintText="Выберите максимальный объём"
                           type="number"
                           errorText={totalAmountLimitError}
                           defaultValue={totalAmountLimit}
                           style={{width: 250}}
                           floatingLabelText="Максимальный объем пула, мл."
                           onChange={e => this.onChange('totalAmountLimit', parseInt(e.target.value, 10))}/>
            </div>
        )
    }
}
PoolScannerConfigs.propTypes = {
    config : PropTypes.shape({
        productBatch : PropTypes.string,
        bloodInvoice : PropTypes.string,
        bloodInvoiceSeries : PropTypes.string,
        poolNumber : PropTypes.number,
        totalAmountLimit : PropTypes.number,
    }).isRequired,
    errors : PropTypes.shape({
        productBatchError : PropTypes.string,
        poolNumberError : PropTypes.string,
        bloodInvoiceError : PropTypes.string,
        bloodInvoiceSeriesError : PropTypes.string,
        totalAmountLimitError : PropTypes.string
    }).isRequired,
    onChange : PropTypes.func.isRequired
};

export default PoolScannerConfigs;