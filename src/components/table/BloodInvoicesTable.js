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
import SumCheckedFooter from './footer/SumCheckedFooter'
import Button from '../Button'
import SimpleValueDialog from './dialog/SimpleValueDialog'

import React from 'react'
import PropTypes from 'prop-types'

class BloodInvoicesTable extends Table {

    constructor(props) {
        super(props);
        this.onBloodDonationsClick=this.onBloodDonationsClick.bind(this);
        this.onAddToBloodInvoiceSeriesOpen = this.onAddToBloodInvoiceSeriesOpen.bind(this);
        this.onAddToBloodInvoiceSeriesClose = this.onAddToBloodInvoiceSeriesClose.bind(this);
        this.onAddToBloodInvoiceSeriesSubmit = this.onAddToBloodInvoiceSeriesSubmit.bind(this);
        this.onAddToBloodInvoiceSeriesValueChanged = this.onAddToBloodInvoiceSeriesValueChanged.bind(this);
        this.state = {
            dialogAddToBloodInvoiceSeries : false
        }
    }

    onBloodDonationsClick(value, row, column, original) {
        const {onBloodDonationsClick} = this.props;
        onBloodDonationsClick && onBloodDonationsClick(value, original, row.localId);
    }

    controls() {
        return [
            {
                control: <Button iconName="picture_as_pdf"
                                 className="change"
                                 title="Назначить серию ПДФ"
                                 key="add_blood_invoice_series"
                                 onClick={this.onAddToBloodInvoiceSeriesOpen}/>,
                onCheckedItems:true
            }
        ]
    }

    onAddToBloodInvoiceSeriesOpen() {
        this.setState({dialogAddToBloodInvoiceSeries:true});
    }

    onAddToBloodInvoiceSeriesClose() {
        this.setState({dialogAddToBloodInvoiceSeries:false});
    }

    onAddToBloodInvoiceSeriesSubmit() {
        const {checkedItems, onChange} = this.props;
        const {bloodInvoiceSeries} = this.state;
        checkedItems && onChange && checkedItems.forEach(item => onChange(item.localId, {bloodInvoiceSeries}));
        this.setState({dialogAddToBloodInvoiceSeries:false});
    }

    onAddToBloodInvoiceSeriesValueChanged(e, value) {
        this.setState({bloodInvoiceSeries : value})
    }

    extraContent() {
        return (
            <SimpleValueDialog title="Введите номер серии ПДФ"
                               inputType="string"
                               open={this.state.dialogAddToBloodInvoiceSeries}
                               onClose={this.onAddToBloodInvoiceSeriesClose}
                               onChange={this.onAddToBloodInvoiceSeriesValueChanged}
                               onSubmit={this.onAddToBloodInvoiceSeriesSubmit} />
        )
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
                Header: "Контейнеры с плазмой",
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
                Footer: (props) => <SumCheckedFooter checkedItems={this.props.checkedItems} {...props}/>,
                sortable: false,
                filterable: false,
                maxWidth: 190
            }, {
                Header: "Серия ПДФ",
                accessor: "bloodInvoiceSeries",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Дата накладной",
                isEditable: true,
                accessor: "deliveryDate",
                inputType: "date",
                onChange: this.onValueChange,
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
    isSimpleTable : PropTypes.bool,
    subComponent : PropTypes.func,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodInvoicesTable;