/**
 * Blood Donations Table
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import TextCell from './cell/TextCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import DropDownCell from './cell/DropDownCell'
import TextFilter from './filter/TextFilter'
import DropDownFilter from './filter/DropDownFilter'
import Table from './Table'

import React from 'react'
import PropTypes from 'prop-types'

class BloodDonationsTable extends Table {

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "invert_colors",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "Штрих-код",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "ID донора",
                accessor: "donor",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Номер накладной",
                accessor: "bloodInvoice",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "ID пула",
                accessor: "bloodPool",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                width: 100
            }, {
                Header: "Тип донации",
                accessor: "donationType",
                onChange: this.onValueChange,
                Cell: DropDownCell,
                isEditable: true,
                allowedValues: [
                    {value: "", displayValue: ""},
                    {value: "plasma-fresh-frozen", displayValue: "Плазма свежезамороженная"}
                ],
                filterable: true,
                Filter: DropDownFilter,
                width: 150
            }, {
                Header: "Объем, мл.",
                accessor: "amount",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                width: 100
            }, {
                Header: "Дата донации",
                accessor: "donationDate",
                onChange: this.onValueChange,
                inputType: "date",
                isEditable: true,
                Cell: DateTimeCell,
                minWidth: 90
            }, {
                Header: "Начало карантина",
                accessor: "quarantineDate",
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
    donor : PropTypes.string,
    bloodInvoice : PropTypes.string,
    bloodPool : PropTypes.string,
    donationType : PropTypes.string,
    amount : PropTypes.number,
    donationDate : PropTypes.string,
    quarantineDate : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
BloodDonationsTable.propTypes = {
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
    isSimpleTable : PropTypes.bool,
    defaultPageSize: PropTypes.number,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodDonationsTable;