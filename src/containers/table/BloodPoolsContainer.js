/**
 * Blood Pools Container
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import BloodPoolsTable from '../../components/table/BloodPoolsTable'
import BloodDonationsContainer from './BloodDonationsContainer'
import ProductBatchesContainer from './ProductBatchesContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodPoolsContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodPoolSubTable = (row) => {
    const bloodDonationsCount = Array.isArray(row.bloodDonations) ? row.bloodDonations.length : undefined;
    return (
        <div className="BloodPoolSubTable">
            <label style={{margin: '20px', fontSize: '18px'}}>
                Контейнеры с плазмой для пула <b>{row.externalId}</b> (количество контейнеров: {bloodDonationsCount || 0})
            </label>
            <BloodDonationsContainer
                isSimpleTable={true}
                tableInstanceId={"bloodPool-" + row.externalId}
                filtered={[{key: "bloodPool", value: row.externalId}]}
                defaultPageSize={bloodDonationsCount}
            />
            <label style={{margin: '20px', fontSize: '18px'}}>Загрузка для пула <b>{row.externalId}</b></label>
            <ProductBatchesContainer
                isSimpleTable={true}
                tableInstanceId={"bloodPool-" + row.externalId}
                filtered={[{key: "externalId", value: row.productBatch}]}
                defaultPageSize={1}
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