/**
 * Blood Donations Container
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import BloodDonationsTable from '../../components/table/BloodDonationsTable'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import PersonsContainer from './PersonsContainer'
import BloodInvoicesContainer from './BloodInvoicesContainer'
import BloodPoolsContainer from './BloodPoolsContainer'
import './BloodDonationsContainer.css'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const BloodDonationSubTable = (row) => {
    return (
        <div className="bloodDonationSubTable">
            <label>Донор контейнера с плазмой <b>{row.externalId}</b></label>
            <PersonsContainer
                isSimpleTable={true}
                tableInstanceId={"bloodDonation-" + row.externalId}
                filtered={[{key: "externalId", value: row.donor}]}
                defaultPageSize={1}
            />
            <label>Накладная контейнера с плазмой <b>{row.externalId}</b></label>
            <BloodInvoicesContainer
                isSimpleTable={true}
                tableInstanceId={"bloodDonation-" + row.externalId}
                filtered={[{key: "externalId", value: row.bloodInvoice}]}
                defaultPageSize={1}
            />
            <label>Пул контейнера с плазмой <b>{row.externalId}</b></label>
            <BloodPoolsContainer
                isSimpleTable={true}
                tableInstanceId={"bloodDonation-" + row.externalId}
                filtered={[{key: "externalId", value: row.bloodPool}]}
                defaultPageSize={1}
            />
        </div>
    )
};

class BloodDonationsContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodDonationsTable {...this.tableProps()} subComponent={BloodDonationSubTable}/>
        )
    }
}
BloodDonationsContainer.propTypes = {
    isSimpleTable: PropTypes.bool,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default connect(mapStateToProps("bloodDonations"), mapDispatchToProps)(BloodDonationsContainer);