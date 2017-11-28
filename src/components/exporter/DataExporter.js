/**
 * Data Exporter
 *
 * Created by Alex Elkin on 24.11.2017.
 */

import AppPage from '../AppPage'
import ProductBatchReportGenerator from './ProductBatchReportGenerator'

import React from 'react'
import PropTypes from 'prop-types'

class DataExporter extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            onDrawerChangeDrawerVisibilityRequest, onExportProductBatch
        } = this.props;
        return (
            <AppPage className="DataExporter"
                     onDrawerChangeDrawerVisibilityRequest={onDrawerChangeDrawerVisibilityRequest}
                     title="Экспорт данных">
                <ProductBatchReportGenerator onSubmit={onExportProductBatch}/>
            </AppPage>
        )
    }
}
DataExporter.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    onExportProductBatch : PropTypes.func
};

export default DataExporter;