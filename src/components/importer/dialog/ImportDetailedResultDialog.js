/**
 * Import Detailed Result Dialog
 *
 * Created by Alex Elkin on 14.11.2017.
 */

import {importResultType} from '../ImportResults'

import React from 'react';
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Chip from 'material-ui/Chip';

const renderListItem = (iconName, countItems, label) => (
    <ListItem leftAvatar={<Avatar icon={<FontIcon className="material-icons">{iconName}</FontIcon>}/>}>
        <Chip><label>{countItems}</label> {label}</Chip>
    </ListItem>
);

const renderImportResult = (importResult) => (
    <List>
        {renderListItem("person", importResult.countPersons, "доноров импортировано")}
        {renderListItem("person", importResult.countBloodDonations, "донаций импортировано")}
        {renderListItem("person", importResult.countBloodInvoices, "накладных импортировано")}
    </List>
);

const YesNoDialog = ({title, open, onRequestClose, importResult}) => (
    <Dialog
        className="ImportDetailedResultDialog"
        title={title}
        actions={[
            <FlatButton
                label={"OK"}
                primary={true}
                keyboardFocused={true}
                onClick={onRequestClose}
            />,
        ]}
        modal={false}
        open={open}
        onRequestClose={onRequestClose}
    >
        {importResult && renderImportResult(importResult)}
    </Dialog>
);

YesNoDialog.propTypes = {
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    title : PropTypes.string,
    importResult : importResultType
};

export default YesNoDialog;