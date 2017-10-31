/**
 * Product Batches Container
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import ProductBatchTable from '../../components/table/ProductBatchTable'
import BloodPoolsContainer from './BloodPoolsContainer'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'
import './ProductBatchesContainer.css'

import React from 'react'
import {connect} from 'react-redux'

const ProductBatchSubTable = (row) => {
    const bloodPoolsCount = Array.isArray(row.bloodPools) ? row.bloodPools.length : undefined;
    return (
        <div className="ProductBatchSubTable">
            <label style={{margin: '20px', fontSize: '18px'}}>Пулы для загрузки № <b>{row.externalId}</b> (количество пулов: {bloodPoolsCount || 0})</label>
            <BloodPoolsContainer
                isSimpleTable={true}
                tableInstanceId={"productBatch-" + row.externalId}
                filtered={[{key: "productBatch", value: row.externalId}]}
                defaultPageSize={bloodPoolsCount}
            />
        </div>
    )
};

class ProductBatchesContainer extends TableContainerAdapter {
    render() {
        return (
            <ProductBatchTable {...this.tableProps()} subComponent={ProductBatchSubTable}/>
        )
    }
}

export default connect(mapStateToProps("productBatches"), mapDispatchToProps)(ProductBatchesContainer);