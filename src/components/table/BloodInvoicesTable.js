/**
 * Blood Invoices
 *
 * Created by Alex Elkin on 25.09.2017.
 */

import TextCell from './cell/TextCell'
import ArrayCell from './cell/ArrayCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import TextFilter from './filter/TextFilter'
import Table from './Table'

import React from 'react'
import PropTypes from 'prop-types'

class BloodInvoicesTable extends Table {

    constructor(props) {
        super(props);
        this.onBloodDonationsClick=this.onBloodDonationsClick.bind(this);
    }

    onBloodDonationsClick(value, row, column, original) {
        const {onBloodDonationsClick} = this.props;
        onBloodDonationsClick && onBloodDonationsClick(value, original, row.localId);
    }

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "format_list_bulleted",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "Номер накладной",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Штрих-коды контейнеров",
                accessor: "bloodDonations",
                iconName: "invert_colors",
                onClick: this.onBloodDonationsClick,
                onChange: this.onValueChange,
                Cell: ArrayCell,
                sortable: false,
                isEditable: true,
                filterable: false,
                Filter: TextFilter
            }, {
                Header: "Суммарный объем, мл.",
                accessor: "totalAmount",
                onChange: this.onValueChange,
                Cell: TextCell,
                sortable: false,
                filterable: false,
                maxWidth: 190
            }, {
                Header: "Дата накладной",
                isEditable: true,
                accessor: "deliveryDate",
                inputType: "date",
                Cell: DateTimeCell,
                minWidth: 90
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                inputType: "datetime-local",
                Cell: DateTimeCell,
                minWidth: 90
            }
        ];
    }
}
const dataItem = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    bloodDonations : PropTypes.arrayOf(PropTypes.string),
    totalAmount : PropTypes.number,
    deliveryDate : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
BloodInvoicesTable.propTypes = {
    name : PropTypes.string,
    data : PropTypes.arrayOf(dataItem),
    checkedItems : PropTypes.arrayOf(dataItem),
    pagesCount: PropTypes.number,
    isFetching : PropTypes.bool,
    isEditing : PropTypes.bool,
    onChange : PropTypes.func,
    onCheckRow : PropTypes.func,
    onDeleteRow : PropTypes.func,
    onEditRow : PropTypes.func,
    onFetchData: PropTypes.func,
    onResetChanges : PropTypes.func,
    onRefreshData : PropTypes.func,
    onSaveChanges : PropTypes.func,
    onAddNewItem : PropTypes.func,
    onBloodDonationsClick: PropTypes.func,
    subComponent : PropTypes.func,

    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodInvoicesTable;