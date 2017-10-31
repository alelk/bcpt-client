/**
 * Simple Value Dialog
 *
 * Created by Alex Elkin on 27.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const SimpleValueDialog = ({open, onClose, onSubmit, onChange, title, inputType}) => (
    <Dialog open={open}
            modal={false}
            onRequestClose={onClose}
            actions={[<RaisedButton label="OK" primary={true} keyboardFocused={true} onClick={onSubmit}/>]}
            title={title}
    >
        <TextField id="value" onChange={onChange} type={inputType}/>
    </Dialog>
);

SimpleValueDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    onClose : PropTypes.func,
    onSubmit : PropTypes.func,
    onChange : PropTypes.func,
    title : PropTypes.string,
    inputType : PropTypes.string
};

export default SimpleValueDialog;