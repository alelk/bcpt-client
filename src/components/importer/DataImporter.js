/**
 * Data Importer
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import DbfFileImportDialog from './dialog/DbfFileImportDialog'

import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class DataImporter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {onDrawerChangeDrawerVisibilityRequest, onImportDbfFile} = this.props;
        return (
            <div className="DataImporter">
                <AppBar onLeftIconButtonTouchTap={onDrawerChangeDrawerVisibilityRequest} title="Импорт данных"/>

                <Card>
                    <CardTitle title="Выбор файла для импорта" subtitle="Выберите файл соответствующего типа"/>
                    <CardActions>
                        <DbfFileImportDialog onSubmit={onImportDbfFile}/>
                    </CardActions>
                </Card>
            </div>
        )
    }
}
DataImporter.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    onImportDbfFile : PropTypes.func
};

export default DataImporter;
