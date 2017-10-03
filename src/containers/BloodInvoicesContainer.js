/**
 * Blood Invoices Container
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import BloodInvoicesTable from '../components/table/BloodInvoicesTable'
import {fetchTableData, edit} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

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
        const {bloodInvoices, isEditMode, edit, isFetching, location, pushUrl} = this.props;
        return (
            <BloodInvoicesTable bloodInvoices={bloodInvoices}
                                isEditMode={isEditMode}
                                isFetching={isFetching}
                                onChange={(localId, changes) => edit("bloodInvoices", localId, changes)}
                                onBloodDonationsClick={ externalIds =>
                                    pushUrl("/table/bloodDonations/?" + externalIds.map(id => "externalId=" + id).join("&"))
                                }
                                onBloodPoolClick={id => pushUrl("/table/bloodPools/?externalId=" + id)}
                                filters={urlQueryAsFilters(location.search)}
            />
        )
    }
}

BloodInvoicesContainer.propTypes = {
    bloodInvoices : PropTypes.object,
    fetchTableData : PropTypes.func,
    pushUrl : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    bloodInvoices: state.tables["bloodInvoices"].data,
    isEditMode: state.tables["bloodInvoices"].isEditing,
    isFetching: state.tables["bloodInvoices"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, edit, pushUrl : push})(BloodInvoicesContainer);