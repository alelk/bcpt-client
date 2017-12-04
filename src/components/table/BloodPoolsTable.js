/**
 * Blood Pools Table
 *
 * Created by Alex Elkin on 02.10.2017.
 */

import TextCell from './cell/TextCell'
import ArrayCell from './cell/ArrayCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import TextFilter from './filter/TextFilter'
import Table from './Table'
import Button from '../Button'
import CreatePoolsDialog from './dialog/CreatePoolsDialog'
import PoolScanningDialog from './dialog/PoolScanningDialog'
import SumCheckedFooter from './footer/SumCheckedFooter'
import {bloodDonationType} from './BloodDonationsTable'

import React from 'react'
import PropTypes from 'prop-types'

class BloodPoolsTable extends Table {

    constructor(props) {
        super(props);
        this.onBloodDonationsClick=this.onBloodDonationsClick.bind(this);
        this.onCreatePoolsOpen = this.onCreatePoolsOpen.bind(this);
        this.onCreatePoolsClose = this.onCreatePoolsClose.bind(this);
        this.onPoolScanningOpen = this.onPoolScanningOpen.bind(this);
        this.onPoolScanningClose = this.onPoolScanningClose.bind(this);
        this.onCreatePoolsSubmit = this.onCreatePoolsSubmit.bind(this);
        this.onPoolScanningSubmit = this.onPoolScanningSubmit.bind(this);
        this.state = {
            isCreatePoolsDialogOpened: false,
            isPoolScanningDialogOpened: false,
            productBatchId : '',
            poolStartNumber : 1,
            poolsCount : 10
        }
    }

    controls() {
        return [
            {
                control: <Button iconName="control_point_duplicate"
                                 className="change"
                                 title="Создать пулы"
                                 key="add_pulls"
                                 onClick={this.onCreatePoolsOpen}/>
            }, {
                control: <Button iconName="camera_alt"
                                 className="change"
                                 title="Создание пулов сканером штрих-кодов"
                                 key="scan_pools"
                                 onClick={this.onPoolScanningOpen}/>
            }
        ]
    }

    onCreatePoolsOpen() {
        this.setState({isCreatePoolsDialogOpened:true})
    }

    onCreatePoolsClose() {
        this.setState({isCreatePoolsDialogOpened:false})
    }

    onCreatePoolsSubmit(productBatchId, poolStartNumber, poolsCount) {
        const {onAddNewItem} = this.props;
        [...new Array(poolsCount).keys()].map(i => ({
            externalId: productBatchId + "-" + (poolStartNumber + i),
            poolNumber : (poolStartNumber + i),
            productBatch : productBatchId
        })).forEach(pool =>
            onAddNewItem && onAddNewItem(pool)
        );
        this.setState({productBatchId, poolStartNumber, poolsCount, isCreatePoolsDialogOpened:false})
    }

    onPoolScanningOpen() {
        this.setState({isPoolScanningDialogOpened:true})
    }

    onPoolScanningClose() {
        this.setState({isPoolScanningDialogOpened:false})
    }

    onPoolScanningSubmit(bloodPools) {
        const {onAddNewItem} = this.props;
        bloodPools && onAddNewItem && bloodPools.forEach(bloodPool => onAddNewItem(bloodPool));
        this.setState({isPoolScanningDialogOpened:false})
    }

    extraContent() {
        const {bloodDonations, onFetchBloodDonation} = this.props;
        return (
            <div>
                <CreatePoolsDialog open={this.state.isCreatePoolsDialogOpened}
                               productBatchId={this.state.productBatchId}
                               poolStartNumber={this.state.poolStartNumber}
                               poolsCount={this.state.poolsCount}
                               onSubmit={this.onCreatePoolsSubmit}
                               onCancel={this.onCreatePoolsClose}/>
                <PoolScanningDialog open={this.state.isPoolScanningDialogOpened}
                                    bloodDonations={bloodDonations}
                                    requestBloodDonation={onFetchBloodDonation}
                                    onSubmit={this.onPoolScanningSubmit}
                                    onCancel={this.onPoolScanningClose}/>
            </div>
        )
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
                iconName: "poll",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "ID пула",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Номер пула",
                accessor: "poolNumber",
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
                sortable: false,
                filterable: false,
                Footer: (props) => <SumCheckedFooter checkedItems={this.props.checkedItems} {...props}/>,
                maxWidth: 190
            }, {
                Header: "ID загрузки",
                accessor: "productBatch",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
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
export const dataItem = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    productBatch : PropTypes.string,
    bloodDonations : PropTypes.arrayOf(PropTypes.string),
    totalAmount : PropTypes.number,
    poolNumber : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
BloodPoolsTable.propTypes = {
    name : PropTypes.string,
    data : PropTypes.arrayOf(dataItem),
    bloodDonations : PropTypes.arrayOf(bloodDonationType),
    onFetchBloodDonation : PropTypes.func,
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

export default BloodPoolsTable;