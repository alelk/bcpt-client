/**
 * Data Importer
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import FileUploader, {categoryType} from '../filemanager/FileManager'
import ImportConfirmDialog from '../dialog/YesNoDialog'

import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class DataImporter extends React.Component {

    constructor(props) {
        super(props);
        this.onSelectFileToImport = this.onSelectFileToImport.bind(this);
        this.onResultImportConfirmation = this.onResultImportConfirmation.bind(this);
        this.state = {
            isImportConfirmDialogOpened: false
        }
    }

    onSelectFileToImport(category, fileName) {
        this.setState({isImportConfirmDialogOpened:true, importingFileName:fileName, importingFileCategory:category});
    }

    onResultImportConfirmation(result) {
        const {onImportFile} = this.props;
        onImportFile && result && onImportFile(this.state.importingFileName, this.state.importingFileCategory);
        this.setState({isImportConfirmDialogOpened:false});
    }

    render() {
        const {
            onDrawerChangeDrawerVisibilityRequest, categories,
            onUploadFile, onFetchUploadedFiles, onDownloadFile, onRemoveFile
        } = this.props;
        const {isImportConfirmDialogOpened, importingFileName, importingFileCategory} = this.state;
        const importingFileCategoryDisplayName = categories && importingFileCategory && categories
                .find(c => c.name === importingFileCategory)['displayName'];
        return (
            <div className="DataImporter">
                <AppBar onLeftIconButtonTouchTap={onDrawerChangeDrawerVisibilityRequest} title="Импорт данных"/>

                <FileUploader title="Файлы для импорта"
                              subtitle="Выберите файл или загрузите новый"
                              categories={categories}
                              onUploadFile={onUploadFile}
                              onDownloadFile={onDownloadFile}
                              onClickFile={this.onSelectFileToImport}
                              onRemoveFile={onRemoveFile}
                              onFetchFiles={onFetchUploadedFiles}/>

                <ImportConfirmDialog open={isImportConfirmDialogOpened}
                                     title={`Подтверждение импорта данных ${importingFileCategoryDisplayName} файла`}
                                     onSelect={this.onResultImportConfirmation}>
                    Импортировать данные файла '{importingFileName}' в базу данных 'BCPT'? Операция необратима и не может быть остановлена.
                </ImportConfirmDialog>
            </div>
        )
    }
}
DataImporter.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    categories : PropTypes.arrayOf(categoryType),
    onUploadFile : PropTypes.func,
    onDownloadFile : PropTypes.func,
    onRemoveFile : PropTypes.func,
    onImportFile : PropTypes.func,
    onFetchUploadedFiles : PropTypes.func
};

export default DataImporter;
