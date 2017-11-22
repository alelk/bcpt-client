/**
 * Blood Invoices Container
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import BloodInvoicesTable from '../../components/table/BloodInvoicesTable'
import BloodDonationsContainer from './BloodDonationsContainer'
import BloodInvoiceSeriesContainer from './BloodInvoiceSeriesContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodInvoicesContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodInvoiceSubTable = (row) => {
    const bloodDonationsSize = Array.isArray(row.bloodDonations) ? row.bloodDonations.length : undefined;
    return (
        <div className="bloodInvoiceBloodDonations">
            {bloodDonationsSize > 0 && <div>
                <label>
                    Контейнеры с плазмой для накладной <b>{row.externalId}</b> (количество контейнеров: {bloodDonationsSize})
                </label>
                <BloodDonationsContainer
                    isSimpleTable={true}
                    tableInstanceId={"bloodInvoice-" + row.externalId}
                    filtered={[{key: "bloodInvoice", value: row.externalId}]}
                    defaultPageSize={bloodDonationsSize}
                />
            </div>}
            {row.bloodInvoiceSeries && <div>
                <label>Серия ПДФ для накладной <b>{row.externalId}</b></label>
                <BloodInvoiceSeriesContainer
                    isSimpleTable={true}
                    tableInstanceId={"bloodInvoice-" + row.externalId}
                    filtered={[{key: "externalId", value: row.bloodInvoiceSeries}]}
                    defaultPageSize={1}
                />
            </div>}
        </div>
    )
};

class BloodInvoicesContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodInvoicesTable {...this.tableProps()} subComponent={BloodInvoiceSubTable}/>
        )
    }
}

export default connect(mapStateToProps("bloodInvoices"), mapDispatchToProps)(BloodInvoicesContainer);