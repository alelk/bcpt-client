/**
 * Persons table
 *
 * Created by Alex Elkin on 13.09.2017.
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

class PersonsTable extends Table {

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "person",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "ID",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Фамилия",
                accessor: "lastName",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
            }, {
                Header: "Имя",
                accessor: "firstName",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Отчество",
                accessor: "middleName",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Группа крови",
                accessor: "bloodType",
                onChange: this.onValueChange,
                Cell: DropDownCell,
                isEditable: true,
                allowedValues: [
                    {value:"", displayValue: ""},
                    {value:"0", displayValue: "0(I)"},
                    {value:"a", displayValue: "A(II)"},
                    {value:"b", displayValue: "B(III)"},
                    {value:"ab", displayValue: "AB(IV)"}
                ],
                filterable: true,
                Filter: DropDownFilter,
                width: 100
            }, {
                Header: "Rh",
                accessor: "rhFactor",
                Cell: DropDownCell,
                isEditable: true,
                onChange: this.onValueChange,
                allowedValues: [
                    {value:"", displayValue: ""},
                    {value:"pos", displayValue: "Rh+"},
                    {value:"neg", displayValue: "Rh-"}
                ],
                filterable: true,
                Filter: DropDownFilter,
                width: 100
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                inputType: "datetime-local",
                Cell:DateTimeCell,
                minWidth: 90
            }
        ];
    }
}
const dataItem = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    firstName : PropTypes.string,
    lastName : PropTypes.string,
    middleName : PropTypes.string,
    groupType : PropTypes.string,
    rhFactor : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
PersonsTable.propTypes = {
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
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};
export default PersonsTable;