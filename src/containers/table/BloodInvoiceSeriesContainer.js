/**
 * Blood Invoice Series Table Container
 *
 * Created by Alex Elkin on 22.11.2017.
 */

import BloodInvoiceSeriesTable from '../../components/table/BloodInvoiceSeriesTable'
import BloodInvoicesContainer from './BloodInvoicesContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodInvoiceSeriesContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodInvoiceSeriesSubTable = (row) => {
    const bloodInvoicesSize = Array.isArray(row.bloodInvoices) ? row.bloodInvoices.length : undefined;
    return (
        <div className="bloodInvoiceSeriesBloodInvoices">
            {bloodInvoicesSize > 0 && <div>
                <label>
                    Накладные из серии ПДФ <b>{row.externalId}</b> (количество накладных: {bloodInvoicesSize})
                </label>
                <BloodInvoicesContainer
                    isSimpleTable={true}
                    tableInstanceId={"bloodInvoiceSeries-" + row.externalId}
                    filtered={[{key: "bloodInvoiceSeries", value: row.externalId}]}
                    defaultPageSize={bloodInvoicesSize}
                />
            </div>}
        </div>
    )
};

class BloodInvoiceSeriesContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodInvoiceSeriesTable {...this.tableProps()} subComponent={BloodInvoiceSeriesSubTable}/>
        )
    }
}

export default connect(mapStateToProps("bloodInvoiceSeries"), mapDispatchToProps)(BloodInvoiceSeriesContainer);