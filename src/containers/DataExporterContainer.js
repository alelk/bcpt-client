/**
 * Data Exporter Container
 *
 * Created by Alex Elkin on 24.11.2017.
 */

import {changeDrawerState} from '../actions/actions'
import {generateProductBatchReport} from '../actions/reportGeneratorActions'
import DataExporter from '../components/exporter/DataExporter'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class DataExporterContainer extends React.Component {

    render() {
        const {
            isDrawerOpened, changeDrawerState, generateProductBatchReport
        } = this.props;
        return (
            <DataExporter onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}
                          onExportProductBatch={generateProductBatchReport}/>
        )
    }
}
DataExporterContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState: PropTypes.func
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened
});
export default connect(
    mapStateToProps,
    {
        changeDrawerState, generateProductBatchReport
    }
)(DataExporterContainer);