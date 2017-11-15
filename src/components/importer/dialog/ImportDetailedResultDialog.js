/**
 * Import Detailed Result Dialog
 *
 * Created by Alex Elkin on 14.11.2017.
 */

import {importResultType} from '../ImportResults'

import React from 'react';
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Chip from 'material-ui/Chip';
import {Card, CardTitle, CardText} from 'material-ui/Card';

const renderListItem = (iconName, countItems, label) => (
    <ListItem>
        <Chip>
            <Avatar icon={<FontIcon className="material-icons">{iconName}</FontIcon>}/>
            <label>{countItems || 0}</label> {label}
        </Chip>
    </ListItem>
);

const renderImportResult = (importResult) => (
    <List>
        {renderListItem("person", importResult.countPersons, "доноров импортировано")}
        {renderListItem("invert_colors", importResult.countBloodDonations, "донаций импортировано")}
        {renderListItem("format_list_bulleted", importResult.countBloodInvoices, "накладных импортировано")}
        {renderListItem("poll", importResult.countBloodPools, "пулов импортировано")}
        {renderListItem("call_merge", importResult.countProductBatches, "загрузок импортировано")}
    </List>
);

const renderImortErrors = (errors) => (
    <List>
        {errors.map((error, key) => (
            <ListItem key={key}>{error}</ListItem>
        ))}
    </List>
);

const ImportDetailedResultDialog = ({title, open, onRequestClose, importResult}) => (
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
        autoScrollBodyContent={true}
    >
        { importResult &&
        <Card>
            <CardTitle title="Состояние процесса импорта" subtitle={`ID процесса: ${importResult.importProcessId}`}/>
            <CardText>
                {`Временная метка: ${new Date(importResult.importTimestamp).toLocaleDateString()} ${new Date(importResult.importTimestamp).toLocaleTimeString()}`}
            </CardText>
            <CardText>
                {`Завершено: ${parseInt(importResult.progress || 0, 10)}%`}
            </CardText>
            <CardText>
                {importResult.operationName}
            </CardText>
        </Card>
        }
        { importResult &&
        <Card>
            <CardTitle title="Импортированные данные"/>
            <CardText>
                {renderImportResult(importResult)}
            </CardText>
        </Card>
        }
        { importResult && Array.isArray(importResult.errors) && importResult.errors.length > 0 &&
        <Card>
            <CardTitle title="Ошибки импорта данных"/>
            <CardText>
                {renderImortErrors(importResult.errors)}
            </CardText>
        </Card>
        }
    </Dialog>
);

ImportDetailedResultDialog.propTypes = {
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    title : PropTypes.string,
    importResult : PropTypes.shape(importResultType)
};

export default ImportDetailedResultDialog;