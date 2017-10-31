/**
 * Create Pools Dialog
 *
 * Created by Alex Elkin on 30.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CreatePoolsDialog extends React.Component {

    constructor(props) {
        super(props);
        const {productBatchId, poolStartNumber, poolsCount} = this.props;
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            productBatchId,
            poolStartNumber,
            poolsCount
        }
    }

    validate(state) {
        const {productBatchId, poolStartNumber, poolsCount} = state;
        return {
            productBatchIdError : productBatchId === undefined || productBatchId.trim() === '' ? "Требуется ввести ID загрузки" : undefined,
            poolStartNumberError : poolStartNumber === undefined || poolStartNumber < 1 ? "Начальный номер пула - число больше 0" : undefined,
            poolsCountError : poolsCount === undefined || poolsCount < 1 ? "Количество пулов - число больше 0" : undefined,
        }
    }

    onChange(fieldName, value) {
        const stateChanges = {[fieldName] : value};
        const changedState = Object.assign({}, this.state, stateChanges);
        Object.assign(stateChanges, this.validate(changedState));
        this.setState(stateChanges);
    }

    onSubmit() {
        const {productBatchId, poolStartNumber, poolsCount} = this.state;
        const {productBatchIdError, poolStartNumberError, poolsCountError} = this.validate(this.state);
        if (this.props.onSubmit && !productBatchIdError && !poolStartNumberError && !poolsCountError)
            this.props.onSubmit(productBatchId, parseInt(poolStartNumber, 10), parseInt(poolsCount, 10));
        else this.setState({productBatchIdError, poolStartNumberError, poolsCountError});
    }

    render() {
        const {open, onCancel} = this.props;
        return (
            <Dialog open={open}
                    actions={[
                        <RaisedButton label="Отмена" onClick={onCancel}/>,
                        <RaisedButton primary={true} label="OK" onClick={this.onSubmit}/>
                    ]}
                    onRequestClose={onCancel}
                    title="Добавление пулов">
                <TextField hintText="Введите ID загрузки"
                           defaultValue={this.state.productBatchId}
                           floatingLabelText="ID загрузки"
                           errorText={this.state.productBatchIdError}
                           onChange={e => this.onChange('productBatchId', e.target.value)}/>
                <TextField hintText="Введите первый номер пула"
                           defaultValue={this.state.poolStartNumber}
                           errorText={this.state.poolStartNumberError}
                           type="number"
                           floatingLabelText="Начальный номер пула"
                           onChange={e => this.onChange('poolStartNumber', e.target.value)}/>
                <TextField hintText="Введите количество пулов"
                           defaultValue={this.state.poolsCount}
                           errorText={this.state.poolsCountError}
                           type="number"
                           floatingLabelText="Количество пулов"
                           onChange={e => this.onChange('poolsCount', e.target.value)}/>
            </Dialog>
        )
    }
}
CreatePoolsDialog.propTypes = {
    open : PropTypes.bool,
    onCancel : PropTypes.func,
    onSubmit : PropTypes.func,
    productBatchId : PropTypes.string,
    poolStartNumber : PropTypes.number,
    poolsCount : PropTypes.number
};
export default CreatePoolsDialog;