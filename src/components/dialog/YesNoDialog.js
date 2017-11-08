/**
 * Yes-No Dialog
 *
 * Created by Alex Elkin on 08.11.2017.
 */

import React from 'react';
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const YesNoDialog = ({positiveButtonText, negativeButtonText, onSelect, title, open, children}) => (
    <Dialog
        className="FileOpenDialog"
        title={title}
        actions={[
            <FlatButton
                label={negativeButtonText || "Отмена"}
                primary={true}
                onClick={() => onSelect && onSelect(false)}
            />,
            <FlatButton
                label={positiveButtonText || "OK"}
                primary={true}
                keyboardFocused={true}
                onClick={() => onSelect && onSelect(true)}
            />,
        ]}
        modal={false}
        open={open}
        onRequestClose={() => onSelect && onSelect(false)}
    >
        {children}
    </Dialog>
);

YesNoDialog.propTypes = {
    open: PropTypes.bool,
    positiveButtonText: PropTypes.string,
    negativeButtonText: PropTypes.string,
    onSelect: PropTypes.func,
    title : PropTypes.string
};

export default YesNoDialog;