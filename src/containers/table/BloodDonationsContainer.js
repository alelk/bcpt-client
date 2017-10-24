/**
 * Blood Donations Container
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import BloodDonationsTable from '../../components/table/BloodDonationsTable'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class BloodDonationsContainer extends TableContainerAdapter {
    render() {
        return (
            <BloodDonationsTable {...this.tableProps()}/>
        )
    }
}
BloodDonationsContainer.propTypes = {
    isSimpleTable: PropTypes.bool,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default connect(mapStateToProps("bloodDonations"), mapDispatchToProps)(BloodDonationsContainer);