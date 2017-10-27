/**
 * Persons Container
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import PersonsTable from '../../components/table/PersonsTable'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'

import React from 'react'
import {connect} from 'react-redux'
import BloodDonationsContainer from './BloodDonationsContainer'
import './PersonsContainer.css'

const PersonSubTable = (row) => {
    return (
        <div className="personBloodDonations">
            <label>Контейнеры с плазмой для донора <b>{row.externalId}</b></label>
            <BloodDonationsContainer
                isSimpleTable={true}
                tableInstanceId={"person-" + row.externalId}
                filtered={[{key: "donor", value: row.externalId}]}
            />
        </div>
    )
};

class PersonsContainer extends TableContainerAdapter {
    render() {
        return (
            <PersonsTable {...this.tableProps()} subComponent={PersonSubTable}/>
        )
    }
}

export default connect(mapStateToProps("persons"), mapDispatchToProps)(PersonsContainer);