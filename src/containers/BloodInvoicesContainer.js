/**
 * Blood Invoices Container
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import BloodInvoicesTable from '../components/table/BloodInvoicesTable'
import {fetchTableData, tableRowChange} from '../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

class BloodInvoicesContainer extends React.Component {

    componentWillMount() {
        if (Object.keys(this.props.bloodInvoices).length <= 0)
            this.props.fetchTableData("bloodInvoices");
    }

    render() {
        const {bloodInvoices, isEditMode, edit, isFetching, filters, pushUrl} = this.props;
        return (
            <BloodInvoicesTable bloodInvoices={bloodInvoices}
                                isEditMode={isEditMode}
                                isFetching={isFetching}
                                onChange={(localId, changes) => edit("bloodInvoices", localId, changes)}
                                onBloodDonationsClick={ (ids, bloodInvoiceId) =>
                                    pushUrl("/table/bloodDonations/?bloodInvoiceExternalId=" + bloodInvoiceId)
                                }
                                onBloodPoolClick={id => pushUrl("/table/bloodPools/?externalId=" + id)}
                                filters={filters}
            />
        )
    }
}

BloodInvoicesContainer.propTypes = {
    bloodInvoices : PropTypes.object,
    filters : PropTypes.arrayOf(PropTypes.shape({id : PropTypes.string, value : PropTypes.string})),
    fetchTableData : PropTypes.func,
    pushUrl : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    bloodInvoices: state.tables["bloodInvoices"].data,
    filters: state.tableFilters["bloodInvoices"],
    isEditMode: state.tables["bloodInvoices"].isEditing,
    isFetching: state.tables["bloodInvoices"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, tableRowChange, pushUrl : push})(BloodInvoicesContainer);