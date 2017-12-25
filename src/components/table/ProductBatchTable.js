/**
 * Product Batch Table
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import TextCell from './cell/TextCell'
import ArrayCell from './cell/ArrayCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import DropDownCell from './cell/DropDownCell'
import TextFilter from './filter/TextFilter'
import Table from './Table'
import SumCheckedFooter from './footer/SumCheckedFooter'

import React from 'react'
import PropTypes from 'prop-types'

class ProductBatchTable extends Table {

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "call_merge",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "ID загрузки",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 100,
            }, {
                Header: "Номер загрузки",
                accessor: "batchNumber",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 80,
            }, {
                Header: "Номера пулов",
                accessor: "bloodPools",
                iconName: "poll",
                onChange: this.onValueChange,
                Cell: ArrayCell,
                sortable: false,
                isEditable: true,
                filterable: false,
                Filter: TextFilter,
                minWidth: 170
            }, {
                Header: "Суммарный объем, мл.",
                accessor: "totalAmount",
                Cell: TextCell,
                Footer: (props) => <SumCheckedFooter checkedItems={this.props.checkedItems} {...props}/>,
                sortable: false,
                filterable: false,
                minWidth: 120,
                maxWidth: 190
            }, {
                Header: "Состояние",
                accessor: "analysisConclusion",
                onChange: this.onValueChange,
                Cell: DropDownCell,
                isEditable: true,
                allowedValues: [
                    {value: "", displayValue: ""},
                    {value: "pass", displayValue: "PASS"},
                    {value: "reject", displayValue: "БРАК"},
                    {value: "conversion", displayValue: "Переработка"},
                ],
                filterable: false,
                sortable: false,
                minWidth: 70
            }, {
                Header: "Дата загрузки",
                isEditable: true,
                accessor: "batchDate",
                inputType: "date",
                sortable: true,
                onChange: this.onValueChange,
                Cell: DateTimeCell,
                minWidth: 90
            }, {
                Header: "Ответственный",
                accessor: "batchAuthor",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 100
            }, {
                Header: "Место проведения",
                accessor: "location",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 120
            }, {
                Header: "Наименование продукта",
                accessor: "productName",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 150
            },{
                Header: "Поставщик",
                accessor: "productProvider",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 100
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
    bloodPools : PropTypes.arrayOf(PropTypes.string),
    totalAmount : PropTypes.number,
    batchDate : PropTypes.string,
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
ProductBatchTable.propTypes = {
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

export default ProductBatchTable;