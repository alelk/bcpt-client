/**
 * Product Batch Table
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import Table, {Cell, IconCell, filterById} from './Table'

import React from 'react'
import PropTypes from 'prop-types'

class ProductBatchTable extends React.Component {

    columns = [
        {Header: "", accessor: "localId", Cell: () => IconCell("call_merge"), width: 30, filterable: false },
        {
            Header: "ID",
            accessor: "externalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            filterMethod: filterById
        }, {
            Header: "Номера пулов",
            accessor: "bloodPoolIds",
            valueSplitRegex: /\s*[;,]\s*/,
            Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onBloodPoolsClick),
            filterMethod: filterById
        }, {
            Header: "Дата загрузки",
            accessor: "batchDate",
            inputType: 'date',
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        },
        {Header: "Суммарная ёмкость", accessor: "totalAmount", Cell: (ci) => Cell(ci, undefined, "localId"), isEditable:false},
        {
            Header: "Последнее изменение",
            accessor: "updateTimestamp",
            inputType: 'datetime',
            minWidth: 130,
            isEditable: false,
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        }
    ];

    render() {
        const {productBatches, isEditMode, isFetching, filters} = this.props;
        const data = Object.keys(productBatches).map(k => Object.assign({}, productBatches[k], {localId: k}));
        return (
            <Table
                defaultSorted={[{id: "localId", desc: false}]}
                sorted={isEditMode ? [{id: "localId", desc: false}] : undefined}
                data={data}
                filterable={true}
                isFetching={isFetching}
                filters={filters}
                columns={isEditMode ? [{
                        Header: "", accessor: "isChecked",
                        Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                        inputType: 'checkbox', width: 30
                    }
                        , ...this.columns] : this.columns
                }
            />
        )
    }
}
ProductBatchTable.propTypes = {
    productBatches : PropTypes.objectOf(PropTypes.shape({
        externalId : PropTypes.string,
        bloodPoolIds : PropTypes.arrayOf(PropTypes.string),
        batchDate : PropTypes.string,
        updateTimestamp : PropTypes.string,
        errors : PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    })).isRequired,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    onChange : PropTypes.func,
    onBloodPoolsClick : PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default ProductBatchTable;