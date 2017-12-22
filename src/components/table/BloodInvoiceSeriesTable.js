/**
 * Blood Invoice Series Table
 *
 * Created by Alex Elkin on 22.11.2017.
 */

import TextCell from './cell/TextCell'
import ArrayCell from './cell/ArrayCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import TextFilter from './filter/TextFilter'
import Table from './Table'
import SumCheckedFooter from './footer/SumCheckedFooter'

import React from 'react'
import PropTypes from 'prop-types'

class BloodInvoiceSeriesTable extends Table {

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "picture_as_pdf",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "Номер серии ПДФ",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 140
            }, {
                Header: "Накладные",
                accessor: "bloodInvoices",
                iconName: "format_list_bulleted",
                onChange: this.onValueChange,
                Cell: ArrayCell,
                sortable: false,
                isEditable: true,
                filterable: false,
                Filter: TextFilter,
                minWidth: 160
            }, {
                Header: "Суммарный объем, мл.",
                accessor: "totalAmount",
                onChange: this.onValueChange,
                Cell: TextCell,
                Footer: (props) => <SumCheckedFooter checkedItems={this.props.checkedItems} {...props}/>,
                sortable: false,
                filterable: false,
                minWidth: 160
            }, {
                Header: "Дата",
                isEditable: true,
                accessor: "seriesDate",
                inputType: "date",
                onChange: this.onValueChange,
                Cell: DateTimeCell,
                minWidth: 130
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                inputType: "datetime-local",
                Cell: DateTimeCell,
                minWidth: 160
            }
        ];
    }
}
const dataItem = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    bloodInvoices : PropTypes.arrayOf(PropTypes.string),
    totalAmount : PropTypes.number,
    seriesDate : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
BloodInvoiceSeriesTable.propTypes = {
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
    subComponent : PropTypes.func,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodInvoiceSeriesTable;