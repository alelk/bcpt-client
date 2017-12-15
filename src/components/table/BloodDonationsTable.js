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
import SumCheckedFooter from './footer/SumCheckedFooter'
import Table from './Table'
import Button from '../Button'
import SimpleValueDialog from './dialog/SimpleValueDialog'
import DonationScanningDialog from './dialog/DonationScanningDialog'

import React from 'react'
import PropTypes from 'prop-types'

class BloodDonationsTable extends Table {

    constructor(props) {
        super(props);
        this.onAddToPoolOpen = this.onAddToPoolOpen.bind(this);
        this.onAddToPoolClose = this.onAddToPoolClose.bind(this);
        this.onAddToPoolSubmit = this.onAddToPoolSubmit.bind(this);
        this.onAddToPoolValueChanged = this.onAddToPoolValueChanged.bind(this);
        this.onDonationScanningOpen = this.onDonationScanningOpen.bind(this);
        this.onDonationScanningClose = this.onDonationScanningClose.bind(this);
        this.onDonationScanningSubmit = this.onDonationScanningSubmit.bind(this);
        this.state = {
            dialogAddToPool : false,
            dialogDonationScanning : false
        }
    }

    controls() {
        return [
            {
                control: <Button iconName="poll"
                                 className="change"
                                 title="Добавить в пул"
                                 key="add_pool"
                                 onClick={this.onAddToPoolOpen}/>,
                onCheckedItems:true
            }, {
                control: <Button iconName="camera_alt"
                                 className="change"
                                 title="Добавление донаций сканером штрих-кодов"
                                 key="scan_bloodDonations"
                                 onClick={this.onDonationScanningOpen}/>
            }
        ]
    }

    onAddToPoolOpen() {
        this.setState({dialogAddToPool:true});
    }

    onAddToPoolClose() {
        this.setState({dialogAddToPool:false});
    }

    onAddToPoolSubmit() {
        const {checkedItems, onChange} = this.props;
        checkedItems && onChange && checkedItems.forEach(item => onChange(item.localId, {bloodPool:this.state.bloodPool}));
        this.setState({dialogAddToPool:false});
    }

    onAddToPoolValueChanged(e, value) {
        this.setState({bloodPool : value})
    }

    onDonationScanningOpen() {
        this.setState({dialogDonationScanning:true})
    }

    onDonationScanningClose() {
        this.setState({dialogDonationScanning:false})
    }

    onDonationScanningSubmit(bloodDonations) {
        this.setState({dialogDonationScanning:false})
    }

    extraContent() {
        const {
            bloodDonations, getOrCreateBloodDonation, getOrCreateBloodInvoice, resetBloodDonationChanges,
            changeScanningProps, poolScanning, addScannedDonation, bloodPools, removeDonationFromPool,
            assignScannedDonationToPool
        } = this.props;
        return (
            <div>
                <SimpleValueDialog title="Введите номер пула"
                                   inputType="string"
                                   open={this.state.dialogAddToPool}
                                   onClose={this.onAddToPoolClose}
                                   onChange={this.onAddToPoolValueChanged}
                                   onSubmit={this.onAddToPoolSubmit} />
                <DonationScanningDialog open={this.state.dialogDonationScanning}
                                        onCancel={this.onDonationScanningClose}
                                        bloodDonations={bloodDonations}
                                        bloodPools={bloodPools}
                                        poolScanning={poolScanning}
                                        requestBloodDonation={getOrCreateBloodDonation}
                                        requestBloodInvoice={getOrCreateBloodInvoice}
                                        resetBloodDonationChanges={resetBloodDonationChanges}
                                        changeScanningProps={changeScanningProps}
                                        addScannedDonation={addScannedDonation}
                                        removeDonationFromPool={removeDonationFromPool}
                                        assignScannedDonationToPool={assignScannedDonationToPool}
                                        onSubmit={this.onDonationScanningSubmit}
                                        changeBloodDonation={this.props.onChange}/>
            </div>
        )
    }

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
                Filter: TextFilter,
                minWidth: 140
            }, {
                Header: "ID донора",
                accessor: "donor",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 110
            }, {
                Header: "Номер накладной",
                accessor: "bloodInvoice",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 140
            }, {
                Header: "ID пула",
                accessor: "bloodPool",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 80
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
                minWidth: 100
            }, {
                Header: "Группа крови",
                accessor: "bloodType",
                onChange: this.onValueChange,
                Cell: DropDownCell,
                isEditable: false,
                allowedValues: [
                    {value:"", displayValue: ""},
                    {value:"0", displayValue: "0(I)"},
                    {value:"a", displayValue: "A(II)"},
                    {value:"b", displayValue: "B(III)"},
                    {value:"ab", displayValue: "AB(IV)"}
                ],
                filterable: true,
                sortable: false,
                Filter: DropDownFilter,
                minWidth: 110
            }, {
                Header: "Rh",
                accessor: "rhFactor",
                Cell: DropDownCell,
                isEditable: false,
                onChange: this.onValueChange,
                allowedValues: [
                    {value:"", displayValue: ""},
                    {value:"pos", displayValue: "Rh+"},
                    {value:"neg", displayValue: "Rh-"}
                ],
                filterable: true,
                sortable: false,
                Filter: DropDownFilter,
                minWidth: 50
            },{
                Header: "Объем, мл.",
                accessor: "amount",
                onChange: this.onValueChange,
                Cell: TextCell,
                type: "number",
                Footer: (props) => <SumCheckedFooter checkedItems={this.props.checkedItems} {...props}/>,
                isEditable: true,
                filterable: true,
                Filter: TextFilter,
                minWidth: 100
            }, {
                Header: "Дата донации",
                accessor: "donationDate",
                onChange: this.onValueChange,
                inputType: "date",
                isEditable: true,
                Cell: DateTimeCell,
                minWidth: 110
            }, {
                Header: "Начало карантина",
                accessor: "quarantineDate",
                inputType: "date",
                Cell: DateTimeCell,
                minWidth: 110
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                inputType: "datetime-local",
                Cell: DateTimeCell,
                minWidth: 110
            }
        ];
    }
}
export const bloodDonationType = PropTypes.shape({
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
    data : PropTypes.arrayOf(bloodDonationType),
    checkedItems : PropTypes.arrayOf(bloodDonationType),
    bloodDonations : PropTypes.arrayOf(bloodDonationType),
    getOrCreateBloodDonation: PropTypes.func,
    getOrCreateBloodInvoice: PropTypes.func,
    changeScanningProps: PropTypes.func,
    addScannedDonation: PropTypes.func,
    removeDonationFromPool: PropTypes.func,
    resetBloodDonationChanges: PropTypes.func,
    poolScanning: PropTypes.object,
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