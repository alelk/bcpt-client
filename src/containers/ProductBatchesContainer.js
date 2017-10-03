/**
 * Product Batches Container
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import ProductBatchesTable from '../components/table/ProductBatchTable'
import {fetchTableData, edit} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

class ProductBatchesContainer extends React.Component {

    componentWillMount() {
        if (Object.keys(this.props.productBatches).length <= 0)
            this.props.fetchTableData("productBatches");
    }

    render() {
        const {productBatches, isEditMode, edit, isFetching, location, pushUrl} = this.props;
        return (
            <ProductBatchesTable productBatches={productBatches}
                                 isEditMode={isEditMode}
                                 isFetching={isFetching}
                                 onChange={(localId, changes) => edit("productBatches", localId, changes)}
                                 filters={urlQueryAsFilters(location.search)}
                                 onBloodPoolsClick={externalIds =>
                                     pushUrl("/table/bloodPools/?" + externalIds.map(id => "externalId=" + id).join("&"))
                                 }
            />
        )
    }
}

ProductBatchesContainer.propTypes = {
    productBatches : PropTypes.object,
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func,
    pushUrl : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    productBatches: state.tables["productBatches"].data,
    isEditMode: state.tables["productBatches"].isEditing,
    isFetching: state.tables["productBatches"].isFetching,
});

export default connect(mapStateToProps, {fetchTableData, edit, pushUrl : push})(ProductBatchesContainer);