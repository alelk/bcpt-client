/**
 * Data Importer Container
 *
 * Created by Alex Elkin on 01.11.2017.
 */
import {changeDrawerState} from '../actions/actions'
import {importDbfFile} from '../actions/importerActions'
import DataImporter from '../components/importer/DataImporter'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const DataImporterContainer = ({isDrawerOpened, changeDrawerState, importDbfFile}) => (
    <DataImporter onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened : !isDrawerOpened})}
                  onImportDbfFile={importDbfFile}
    />
);
DataImporterContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState : PropTypes.func
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened
});
export default connect(mapStateToProps, {changeDrawerState, importDbfFile})(DataImporterContainer);