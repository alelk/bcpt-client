/**
 * Blood Pools Container
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import BloodPoolsTable from '../../components/table/BloodPoolsTable'
import BloodDonationsContainer from './BloodDonationsContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodPoolsContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodPoolSubTable = (row) => {
    return (
        <div className="BloodPoolSubTable">
            <label style={{margin: '20px', fontSize: '18px'}}>Контейнеры с плазмой для пула {row.externalId}</label>
            <BloodDonationsContainer
                isSimpleTable={true}
                tableInstanceId={"bloodPool-" + row.externalId}
                filtered={[{key: "bloodPool", value: row.externalId}]}
                defaultPageSize={Array.isArray(row.bloodDonations) && row.bloodDonations.length || undefined}
            />
        </div>
    )
};

class BloodPoolsContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodPoolsTable {...this.tableProps()} subComponent={BloodPoolSubTable}/>
        )
    }
}

export default connect(mapStateToProps("bloodPools"), mapDispatchToProps)(BloodPoolsContainer);