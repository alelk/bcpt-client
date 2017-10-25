/**
 * Blood Invoices Container
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import BloodInvoicesTable from '../../components/table/BloodInvoicesTable'
import BloodDonationsContainer from './BloodDonationsContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodInvoicesContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodInvoiceSubTable = (row) => {
    return (
        <div className="bloodInvoiceBloodDonations">
            <label style={{margin: '20px', fontSize: '18px'}}>Контейнеры с плазмой для накладной {row.externalId}</label>
            <BloodDonationsContainer
                isSimpleTable={true}
                filtered={[{key: "bloodInvoice", value: row.externalId}]}
                defaultPageSize={Array.isArray(row.bloodDonations) && row.bloodDonations.length || undefined}
            />
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