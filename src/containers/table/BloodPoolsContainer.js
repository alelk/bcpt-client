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
import {fetchTableRow} from '../../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
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
        const {bloodDonationItems, fetchTableRow} = this.props;
        const bloodDonations = bloodDonationItems && Object.keys(bloodDonationItems).map(localId => Object.assign({localId}, bloodDonationItems[localId]));
        return (
            <BloodPoolsTable {...this.tableProps()}
                             bloodDonations={bloodDonations}
                             onFetchBloodDonation={localId => fetchTableRow("bloodDonations", localId)}
                             subComponent={BloodPoolSubTable}/>
        )
    }
}

BloodPoolsContainer.propTypes = {
    fetchTableRow: PropTypes.func,
    bloodDonationItems: PropTypes.object
};

export const _mapStateToProps = (state, ownProps) => {
    return {
        bloodDonationItems: state.tableItems["bloodDonations"],
        ...mapStateToProps("bloodPools")(state, ownProps)
    }
};

export default connect(_mapStateToProps, {fetchTableRow, ...mapDispatchToProps})(BloodPoolsContainer);