/**
 * Blood Donations Container
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import BloodDonationsTable from '../components/table/BloodDonationsTable'
import {fetchTableData, edit} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

class BloodDonationsContainer extends React.Component {

    componentWillMount() {
        if (Object.keys(this.props.bloodDonations).length <= 0)
            this.props.fetchTableData("bloodDonations");
    }

    render() {
        const {bloodDonations, isEditMode, edit, isFetching, location, pushUrl} = this.props;
        return (
            <BloodDonationsTable bloodDonations={bloodDonations}
                                 isEditMode={isEditMode}
                                 isFetching={isFetching}
                                 onChange={(localId, changes) => edit("bloodDonations", localId, changes)}
                                 onDonorClick={(donorId) => pushUrl("/table/persons?externalId=" + donorId)}
                                 onBloodInvoiceClick={(bloodInvoiceId) => pushUrl("/table/bloodInvoices?externalId=" + bloodInvoiceId)}
                                 filters={urlQueryAsFilters(location.search)}
            />
        )
    }
}

BloodDonationsContainer.propTypes = {
    bloodDonations : PropTypes.object,
    fetchTableData : PropTypes.func,
    pushUrl : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    bloodDonations: state.tables["bloodDonations"].data,
    isEditMode: state.tables["bloodDonations"].isEditing,
    isFetching: state.tables["bloodDonations"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, edit, pushUrl:push})(BloodDonationsContainer);