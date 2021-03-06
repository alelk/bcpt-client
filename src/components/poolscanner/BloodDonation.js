/**
 * Blood Donation
 *
 * Created by Alex Elkin on 07.12.2017.
 */

import React from 'react';
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

class BloodDonation extends React.Component {

    constructor(props) {
        super(props);
        this.onApply = this.onApply.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            amountError: undefined
        }
    }

    onApply() {
        const {bloodDonation, onApply} = this.props;
        if (!bloodDonation.amount || bloodDonation.amount <= 0) {
            this.setState({amountError: "Неверный объём"});
            console.log(`Incorrect blood donation amount: ${bloodDonation.amount}. Blood donation:`, bloodDonation)
        }
        else onApply && onApply(bloodDonation.localId, bloodDonation)
    }

    onChange(localId, fieldName, value) {
        const {onChangeBloodDonation} = this.props;
        this.setState({amountError: undefined});
        onChangeBloodDonation && onChangeBloodDonation(localId, {[fieldName]: value})
    }

    render() {
        const {bloodDonation, onDeleteBloodDonation, poolNumber} = this.props;
        const {localId, amount, bloodInvoice, analysisConclusion, externalId} = bloodDonation;
        return (
            <Paper style={{padding: 6, display:'inline-block', margin: 10, flexGrow: 1}} zDepth={3}>
                <div style={/pass/.test(analysisConclusion) ? {backgroundColor:'#86d6b5'} :
                    /reject/.test(analysisConclusion) ? {backgroundColor:'#d68b8d'} :
                        /conversion/.test(analysisConclusion) ? {backgroundColor:'#a1bdd6'} : undefined}>
                    <span>Донация</span>
                    <span style={{fontSize: '1.1em', padding: "0 20px", fontWeight: 800}}>{externalId}</span>
                    { /reject|conversion/.test(analysisConclusion) &&
                    <span style={{color: '#5a0009', padding: "0 20px", fontWeight: 800}}>
                        {/reject/.test(analysisConclusion) ? "БРАК" : "Переработка"}
                        </span>
                    }
                    <TextField floatingLabelText="Объём (мл.)"
                               defaultValue={amount}
                               type="number"
                               hintText="Введите объём"
                               errorText={this.state.amountError}
                               style={{width:150}}

                               onBlur={() => console.log("On blur!")}
                               onChange={e => this.onChange(localId, "amount", parseInt(e.target.value, 10))}/>
                    <TextField floatingLabelText="Номер накладной"
                               value={bloodInvoice}
                               hintText="Введите ID"
                               style={{width:150}}
                               onChange={e => this.onChange(localId, "bloodInvoice", e.target.value)}/>
                </div>
                <FlatButton label="Удалить"
                            labelPosition="after"
                            icon={<FontIcon className="material-icons">cancel</FontIcon>}
                            onClick={onDeleteBloodDonation && (() => onDeleteBloodDonation(localId, bloodDonation))}/>
                <FlatButton primary
                            label={`Добавить в пул ${poolNumber}`}
                            labelPosition="after"
                            onClick={this.onApply}
                            icon={<FontIcon className="material-icons">arrow_downward</FontIcon>}/>
            </Paper>
        )
    }
}
BloodDonation.propTypes = {
    bloodDonation: PropTypes.object,
    poolNumber: PropTypes.number,
    onDeleteBloodDonation: PropTypes.func,
    onChangeBloodDonation: PropTypes.func,
    onApply: PropTypes.func
};
export default BloodDonation;