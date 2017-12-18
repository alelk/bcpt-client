/**
 * Donations Scanning Field
 *
 * Created by Alex Elkin on 18.12.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

class DonationsScanningField extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            bloodDonationIds: ""
        }
    }

    onChange(value) {
        const {onNewBloodDonation} = this.props;
        const result = /^\s*(\w+\s+)*(\w{6,20})\s+(\d{2,4})\s+$/.exec(value);
        const localId = result && result[2];
        const amount = result && result[3];
        if (localId && amount) {
            onNewBloodDonation(localId, parseInt(amount, 10));
            this.setState({
                bloodDonationIds: value.replace(new RegExp(localId + "\\s+" + amount + "\\s+"), "\t").replace(/^\s+/, '')
            });
        } else
            this.setState({bloodDonationIds: value.replace(/\s+/g, '\t')});
    }

    render() {
        const {hintText, floatingLabelText, scannedTextError} = this.props;
        return (
            <TextField hintText={hintText || "Сканируйте штрих-код донации, затем введите объем (мл.) и нажмите Enter"}
                       value={this.state.bloodDonationIds}
                       errorText={scannedTextError}
                       multiLine
                       fullWidth
                       rows={1}
                       rowsMax={4}
                       type="text"
                       floatingLabelText={floatingLabelText || "[Штрих-код донации] пробел [Объем донации, мл.] пробел"}
                       onChange={e => this.onChange(e.target.value)}/>
        )
    }
}
DonationsScanningField.propTypes = {
    hintText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    scannedTextError: PropTypes.string,
    onNewBloodDonation: PropTypes.func
};

export default DonationsScanningField;