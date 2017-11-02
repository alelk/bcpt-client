/**
 * Data Importer Container
 *
 * Created by Alex Elkin on 01.11.2017.
 */
import {changeDrawerState} from '../actions/actions'
import {uploadFile} from '../actions/uploaderActions'
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

const DataImporterContainer = ({isDrawerOpened, changeDrawerState, uploadFile, uploads, uploadedFiles}) => {
    return (
        <DataImporter onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}
                      onUploadFile={(file, category) => uploadFile(file, category.name)}
                      categories={buildCategories(uploads, uploadedFiles)}
        />
    )
};
DataImporterContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState : PropTypes.func,
    uploads : PropTypes.object,
    uploadedFiles: PropTypes.object
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened,
    uploads: state.uploads,
    uploadedFiles: state.uploadedFiles
});
export default connect(mapStateToProps, {changeDrawerState, uploadFile})(DataImporterContainer);