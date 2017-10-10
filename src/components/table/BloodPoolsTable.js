/**
 * Blood Pools Table
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import Table, {Cell, IconCell, filterById} from './Table'
import DateTimeCell from './cell/DateTimeCell'
import TextCell from './cell/TextCell'

import React from 'react'
import PropTypes from 'prop-types'

class BloodPoolsTable extends React.Component {

    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(value, row, column) {
        this.props.onChange && this.props.onChange(row.externalId, {[column.id] : value});
    }

    componentWillMount() {
        this.columns = [
            {Header: "", accessor: "localId", Cell: () => IconCell("poll"), width: 30, filterable: false },
            {
                Header: "ID",
                accessor: "externalId",
                inputType: 'text',
                isEditable: true,
                onChange: this.onValueChange,
                Cell: TextCell,
                filterMethod: filterById
            }, {
                Header: "Номер пула",
                accessor: "poolNumber",
                inputType: 'text',
                isEditable: true,
                onChange: this.onValueChange,
                Cell: TextCell,
                filterMethod: filterById
            }, {
                Header: "Номера накладных",
                accessor: "bloodInvoiceIds",
                valueSplitRegex: /\s*[;,]\s*/,
                Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onBloodInvoicesClick),
                filterMethod: filterById
            }, {
                Header: "Суммарная ёмкость",
                accessor: "totalAmount",
                isEditable:false
            }, {
                Header: "Номер загрузки",
                accessor: "productBatchExternalId",
                inputType: 'text',
                isEditable: true,
                onChange: this.onValueChange,
                Cell: TextCell,
                filterMethod: filterById
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                minWidth: 130,
                inputType: 'datetime-local',
                isEditable: false,
                Cell: DateTimeCell,
            }
        ];
    }

    render() {
        const {bloodPools, isEditMode, isFetching, filters} = this.props;
        const data = Object.keys(bloodPools).map(k => Object.assign({}, bloodPools[k], {localId: k}));
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
BloodPoolsTable.propTypes = {
    bloodPools : PropTypes.objectOf(PropTypes.shape({
        externalId : PropTypes.string,
        poolNumber : PropTypes.string,
        bloodInvoiceIds : PropTypes.arrayOf(PropTypes.string),
        updateTimestamp : PropTypes.string,
        errors : PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    })).isRequired,
    isFetching : PropTypes.bool,
    isEditMode : PropTypes.bool,
    onChange : PropTypes.func,
    onBloodInvoicesClick : PropTypes.func,
    onProductBatchClick : PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodPoolsTable;