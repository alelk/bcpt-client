/**
 * Data Importer
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import FileUploader, {categoryType} from '../filemanager/FileManager'

import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class DataImporter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            onDrawerChangeDrawerVisibilityRequest, categories, onUploadFile, onFetchUploadedFiles, onDownloadFile
        } = this.props;
        console.log("categories: ", categories);
        return (
            <div className="DataImporter">
                <AppBar onLeftIconButtonTouchTap={onDrawerChangeDrawerVisibilityRequest} title="Импорт данных"/>

                <FileUploader title="Файлы для импорта"
                              subtitle="Выберите файл или загрузите новый"
                              categories={categories}
                              onUploadFile={onUploadFile}
                              onDownloadFile={onDownloadFile}
                              onFetchFiles={onFetchUploadedFiles}/>
            </div>
        )
    }
}
DataImporter.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    categories : PropTypes.arrayOf(categoryType),
    onUploadFile : PropTypes.func,
    onDownloadFile : PropTypes.func,
    onFetchUploadedFiles : PropTypes.func
};

export default DataImporter;
