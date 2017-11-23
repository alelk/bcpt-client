/**
 * Blood Pool Analysis Container
 *
 * Created by Alex Elkin on 23.11.2017.
 */

import BloodPoolAnalysisTable from '../../components/table/BloodPoolAnalysisTable'
import BloodDonationsContainer from './BloodDonationsContainer'
import ProductBatchesContainer from './ProductBatchesContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './BloodPoolAnalysisContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const BloodPoolAnalysisSubTable = (row) => {
    const bloodDonationsCount = Array.isArray(row.bloodDonations) ? row.bloodDonations.length : undefined;
    return (
        <div className="BloodPoolAnalysisSubTable">
            {bloodDonationsCount > 0 && <div>
                <label>
                    Контейнеры с плазмой для пула <b>{row.externalId}</b> (количество контейнеров: {bloodDonationsCount || 0})
                </label>
                <BloodDonationsContainer
                    isSimpleTable={true}
                    tableInstanceId={"bloodPoolAnalyses-" + row.externalId}
                    filtered={[{key: "bloodPool", value: row.externalId}]}
                    defaultPageSize={bloodDonationsCount}
                />
            </div>}
            {row.productBatch && <div>
                <label>Загрузка для пула <b>{row.externalId}</b></label>
                <ProductBatchesContainer
                    isSimpleTable={true}
                    tableInstanceId={"bloodPoolAnalyses-" + row.externalId}
                    filtered={[{key: "externalId", value: row.productBatch}]}
                    defaultPageSize={1}
                />
            </div>}
        </div>
    )
};

class BloodPoolAnalysisContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodPoolAnalysisTable {...this.tableProps()} subComponent={BloodPoolAnalysisSubTable}/>
        )
    }
}

export default connect(mapStateToProps("bloodPoolAnalysis"), mapDispatchToProps)(BloodPoolAnalysisContainer);