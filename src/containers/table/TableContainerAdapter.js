/**
 * Table Container
 *
 * Created by Alex Elkin on 14.09.2017.
 */
import {
    fetchTableData, tableRowChange, checkTableRow, deleteTableRow, editTableRow,
    resetTableChanges, saveChanges, tableRowCreate
} from '../../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import {connect} from 'react-redux'

class TableContainerAdapter extends React.Component {

    constructor(props) {
        super(props);
        this.onFetchData = this.onFetchData.bind(this);
        this.onTableRowChange = this.onTableRowChange.bind(this);
        this.onCheckTableRow = this.onCheckTableRow.bind(this);
        this.onDeleteTableRow = this.onDeleteTableRow.bind(this);
        this.onEditTableRow = this.onEditTableRow.bind(this);
        this.onResetTableChanges = this.onResetTableChanges.bind(this);
        this.onSaveChanges = this.onSaveChanges.bind(this);
        this.onTableRowCreate = this.onTableRowCreate.bind(this);
    }

    onFetchData(pageNumber, itemsPerPage, sorted, filtered) {
        this.props.fetchTableData(this.props.tableName, pageNumber, itemsPerPage, sorted, filtered);
    }

    onTableRowChange(localId, changes) {
        this.props.tableRowChange(this.props.tableName, localId, changes);
    }

    onCheckTableRow(localId, changes) {
        this.props.checkTableRow(this.props.tableName, localId, changes);
    }

    onDeleteTableRow(localId) {
        this.props.deleteTableRow(this.props.tableName, localId);
    }

    onEditTableRow(localId) {
        this.props.editTableRow(this.props.tableName, localId);
    }

    onResetTableChanges() {
        this.props.resetTableChanges(this.props.tableName);
    }

    onSaveChanges() {
        this.props.saveChanges(this.props.tableName);
    }

    onTableRowCreate() {
        this.props.tableRowCreate(this.props.tableName);
    }

    tableProps() {
        const {table, pages, items, isSimpleTable, filtered, defaultPageSize} = this.props;
        const page = table && pages && pages[table.pageNumber];
        const data = page && page.items && items && page.items.map(localId => Object.assign({localId}, items[localId]));
        const checkedItems = (
                table && Array.isArray(table.checkedItems) && items &&
                table.checkedItems.map(localId => Object.assign({localId}, items[localId]))
            ) || undefined;
        return {
            name : table && table.displayName,
            data,
            checkedItems,
            pagesCount : page && page.pagesCount,
            isEditing : table && table.isEditing,
            isFetching : page && page.isFetching,
            onFetchData : this.onFetchData,
            onChange : this.onTableRowChange,
            onCheckRow : this.onCheckTableRow,
            onDeleteRow : this.onDeleteTableRow,
            onEditRow : this.onEditTableRow,
            onResetChanges : this.onResetTableChanges,
            onRefreshData : this.onResetTableChanges,
            onSaveChanges : this.onSaveChanges,
            onAddNewItem : this.onTableRowCreate,
            isSimpleTable,
            filtered,
            defaultPageSize
        }
    }

    render() {
        return (
            <div>
                Error: This is needed to override render() method in the child component.
            </div>
        )
    }
}

TableContainerAdapter.propTypes = {
    table : PropTypes.object,
    pages : PropTypes.object,
    items : PropTypes.object,
    isSimpleTable: PropTypes.bool,
    defaultPageSize: PropTypes.number,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string})),
    fetchTableData : PropTypes.func,
    tableRowChange : PropTypes.func,
    checkTableRow : PropTypes.func,
    deleteTableRow : PropTypes.func,
    editTableRow : PropTypes.func,
    resetTableChanges: PropTypes.func,
    tableRowCreate: PropTypes.func,
    saveChanges: PropTypes.func,
};

export const mapStateToProps = (tableName) => (state, ownProps) => {
    return {
        tableName,
        isSimpleTable: ownProps.isSimpleTable,
        filtered: ownProps.filtered,
        defaultPageSize : ownProps.defaultPageSize,
        table: state.tables[tableName],
        pages: state.tablePages[tableName],
        items: state.tableItems[tableName]
    }
};

export const mapDispatchToProps = {
    fetchTableData, tableRowChange, checkTableRow, deleteTableRow,
    editTableRow, resetTableChanges, saveChanges, tableRowCreate
};

export default TableContainerAdapter;