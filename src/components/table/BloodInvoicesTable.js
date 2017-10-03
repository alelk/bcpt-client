/**
 * Blood Invoices
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import Table, {Cell, IconCell, filterById} from './Table'

import React from 'react'
import PropTypes from 'prop-types'

class BloodInvoicesTable extends React.Component {

    columns = [
        {Header: "", accessor: "localId", Cell: () => IconCell("format_list_bulleted"), width: 30, filterable: false },
        {
            Header: "ID",
            accessor: "externalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            filterMethod: filterById
        },{
            Header: "Номера контейнеров",
            accessor: "bloodDonationExternalIds",
            valueSplitRegex: /\s*[;,]\s*/,
            Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onBloodDonationsClick),
            filterMethod: filterById
        }, {
            Header: "Суммарная ёмкость",
            accessor: "totalAmount",
            Cell: (ci) => Cell(ci, undefined, "localId"),
            isEditable:false
        }, {
            Header: "ID пула",
            accessor: "bloodPoolExternalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onBloodPoolClick)
        }, {
            Header: "Дата накладной",
            accessor: "deliveryDate",
            inputType: 'date',
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            filterMethod: filterById
        }, {
            Header: "Последнее изменение",
            accessor: "updateTimestamp",
            inputType: 'datetime',
            minWidth: 130,
            isEditable: false,
            Cell: (ci) => Cell(ci, undefined, "localId")
        }
    ];

    render() {
        const {bloodInvoices, isEditMode, isFetching, filters} = this.props;
        const data = Object.keys(bloodInvoices).map(k => Object.assign({}, bloodInvoices[k], {localId: k}));
        return (
            <Table
                defaultSorted={[{id: "localId", desc: false}]}
                sorted={isEditMode ? [{id: "localId", desc: false}] : undefined}
                data={data}
                isFetching={isFetching}
                filterable={true}
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
BloodInvoicesTable.propTypes = {
    bloodInvoices : PropTypes.objectOf(PropTypes.shape({
        externalId : PropTypes.string,
        deliveryDate : PropTypes.string,
        bloodDonationExternalIds : PropTypes.arrayOf(PropTypes.string),
        errors : PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    })).isRequired,
    isFetching : PropTypes.bool,
    isEditMode : PropTypes.bool,
    onChange : PropTypes.func,
    onBloodDonationsClick : PropTypes.func,
    onBloodPoolClick : PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodInvoicesTable;