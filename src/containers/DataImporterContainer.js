/**
 * Data Importer Container
 *
 * Created by Alex Elkin on 01.11.2017.
 */
import {changeDrawerState} from '../actions/actions'
import {uploadFile, fetchUploadedFiles, downloadFile, removeFile} from '../actions/uploaderActions'
import {
    importFile, subscribeImporterProcesses, unsubscribeImporterProcesses, fetchImportResults
} from '../actions/importerActions'
import DataImporter from '../components/importer/DataImporter'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const buildCategories = (uploads, uploadedFiles) => {
    return Object.keys(uploads).map(categoryName => {
        const categoryFiles = uploadedFiles && uploadedFiles[categoryName];
        const files = (categoryFiles && Object.keys(categoryFiles).map(fileName => categoryFiles[fileName])) || [];
        return Object.assign({}, uploads[categoryName], {name: categoryName, files});
    });
};

const mapImports = (imports) => Object.keys(imports).map(key => imports[key]);

class DataImporterContainer extends React.Component {

    componentDidMount() {
        this.props.fetchImportResults();
        this.props.subscribeImporterProcesses();
    }

    componentWillUnmount() {
        this.props.unsubscribeImporterProcesses();
    }

    render() {
        const {
            isDrawerOpened, changeDrawerState, uploadFile, uploads, imports,
            uploadedFiles, fetchUploadedFiles, downloadFile,
            removeFile, importFile
        } = this.props;
        return (
            <DataImporter onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}
                          onUploadFile={(file, category) => uploadFile(file, category.name)}
                          onDownloadFile={downloadFile}
                          onRemoveFile={removeFile}
                          categories={buildCategories(uploads, uploadedFiles)}
                          imports={mapImports(imports)}
                          onFetchUploadedFiles={fetchUploadedFiles}
                          onImportFile={importFile}
            />
        )
    }
}
DataImporterContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState : PropTypes.func,
    uploads : PropTypes.object,
    imports : PropTypes.object,
    uploadedFiles: PropTypes.object,
    fetchUploadedFiles : PropTypes.func,
    uploadFile : PropTypes.func,
    downloadFile : PropTypes.func,
    importFile : PropTypes.func,
    removeFile : PropTypes.func,
    subscribeImporterProcesses : PropTypes.func,
    unsubscribeImporterProcesses : PropTypes.func,
    fetchImportResults : PropTypes.func,
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened,
    uploads: state.uploads,
    imports : state.imports,
    uploadedFiles: state.uploadedFiles
});
export default connect(
    mapStateToProps,
    {
        changeDrawerState,
        uploadFile,
        fetchUploadedFiles,
        downloadFile,
        removeFile,
        importFile,
        subscribeImporterProcesses,
        unsubscribeImporterProcesses,
        fetchImportResults
    }
)(DataImporterContainer);