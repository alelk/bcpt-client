/**
 * Blood Pools Container
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import BloodPoolsTable from '../components/table/BloodPoolsTable'
import {fetchTableData, edit} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

class BloodPoolsContainer extends React.Component {

    componentWillMount() {
        if (Object.keys(this.props.bloodPools).length <= 0)
            this.props.fetchTableData("bloodPools");
    }

    render() {
        const {bloodPools, isEditMode, edit, isFetching, location, pushUrl} = this.props;
        return (
            <BloodPoolsTable bloodPools={bloodPools}
                             isEditMode={isEditMode}
                             isFetching={isFetching}
                             onChange={(localId, changes) => edit("bloodPools", localId, changes)}
                             filters={urlQueryAsFilters(location.search)}
                             onProductBatchClick={id => pushUrl("/table/productBatches?externalId=" + id)}
                             onBloodInvoicesClick={externalIds =>
                                 pushUrl("/table/bloodInvoices/?" + externalIds.map(id => "externalId=" + id).join("&"))
                             }
            />
        )
    }
}

BloodPoolsContainer.propTypes = {
    bloodPools : PropTypes.object,
    fetchTableData : PropTypes.func,
    pushUrl : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    bloodPools: state.tables["bloodPools"].data,
    isEditMode: state.tables["bloodPools"].isEditing,
    isFetching: state.tables["bloodPools"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, edit, pushUrl:push})(BloodPoolsContainer);