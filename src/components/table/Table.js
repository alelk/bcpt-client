/**
 * Table
 *
 * Created by Alex Elkin on 14.09.2017.
 */
import EditableTable from './EditableTable'
import CheckboxCell from './cell/CheckboxCell'
import EditableLabel from '../editable/EditableLabel'
import "./Table.css"

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import queryString from 'query-string'

export const Cell = (cellInfo, onChange, keyName, onClick) => (
    <EditableLabel key={cellInfo.original[keyName]} value={cellInfo.value}
                   valueSet={cellInfo.column.allowedValues}
                   valueSplitRegex={cellInfo.column.valueSplitRegex}
                   inputType={cellInfo.column.inputType}
                   isEditable={cellInfo.column.isEditable}
                   isEditMode={cellInfo.original.isEditing}
                   onClick={onClick && (() => onClick(cellInfo.value, cellInfo.original[keyName]))}
                   onChange={(value) => onChange && onChange(cellInfo.original[keyName], {[cellInfo.column.id]: value})}
                   error={ Array.isArray(cellInfo.original.errors)
                       ? cellInfo.original.errors.find(error => error.field === cellInfo.column.id)
                       : null
                   }
                   isDeleted={cellInfo.original.isDeleted}
    />
);

export const filterById = (filter, row) => {
    if (filter.value == null || filter.value === '') return true;
    return String(filter.value).split(/\s*[,;]\s*/, -1).find(fStr => String(fStr).toLowerCase() === String(row[filter.id]).toLowerCase()) != null;
};

export const IconCell = (iconName) => {
    return (
        <i className="material-icons rowIcon">{iconName}</i>
    )
};

export const urlQueryAsFilters = (queryStr) => {
    if (queryStr == null) return null;
    const parsed = queryString.parse(queryStr);
    return Object.keys(parsed).map((key) => ({id:key, value:parsed[key]}))
        .map(filter => Array.isArray(filter.value) ? Object.assign({}, filter, {value: filter.value.join(",")}) : filter);
};

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.onFetchData = this.onFetchData.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onCheckRow = this.onCheckRow.bind(this);
        this.onUncheckRows = this.onUncheckRows.bind(this);
        this.onCheckAllRows = this.onCheckAllRows.bind(this);
        this.onDeleteRows = this.onDeleteRows.bind(this);
        this.onEditRows = this.onEditRows.bind(this);
        this.onAddRow = this.onAddRow.bind(this);
    }

    /**
     * Should be override child component
     * @returns {Array}
     */
    columns() {
        return []
    }

    _columns() {
        if (this.columnsData == null) {
            this.columnsData = this.props.isSimpleTable
                ? this.columns().map(c => Object.assign({}, c, {filterable:false, Filter:undefined}))
                : [
                    {
                        accessor: "isChecked",
                        Cell: CheckboxCell,
                        onChange: this.onCheckRow,
                        width: 30
                    },
                    ...this.columns()
                ]
        }
        return this.columnsData;
    }

    onFetchData(state) {
        this.props.onFetchData(
            state.page + 1,
            state.pageSize,
            state.sorted,
            state.filtered
        );
    }

    onCheckRow(value, row) {
        this.props.onCheckRow && this.props.onCheckRow(row.localId, {isChecked: value});
    }

    onUncheckRows() {
        const {checkedItems, onCheckRow} = this.props;
        checkedItems && onCheckRow && checkedItems.forEach(ci => onCheckRow(ci.localId, {isChecked:false}))
    }

    onCheckAllRows() {
        const {data, onCheckRow} = this.props;
        data && onCheckRow && data.forEach(row => onCheckRow(row.localId, {isChecked: true}));
    }

    onDeleteRows() {
        const {checkedItems, onDeleteRow} = this.props;
        checkedItems && onDeleteRow && checkedItems.map(ci => onDeleteRow(ci.localId));
        this.onUncheckRows();
    }

    onEditRows() {
        const {checkedItems, onEditRow} = this.props;
        checkedItems && onEditRow && checkedItems.map(ci => onEditRow(ci.localId));
        this.onUncheckRows();
    }

    onAddRow() {
        const {onAddNewItem} = this.props;
        onAddNewItem && onAddNewItem();
    }

    onValueChange(value, row, column) {
        this.props.onChange && this.props.onChange(row.localId, {[column.id]: value});
    }

    controls() {}

    extraContent() {}

    renderReactTable() {
        const {data, pagesCount, isFetching, subComponent, filtered, isSimpleTable, defaultPageSize} = this.props;
        return (
            <ReactTable
                style={isSimpleTable && {padding:'20px'}}
                data={data || []}
                manual
                onFetchData={this.onFetchData}
                loading={isFetching}
                columns={this._columns()}
                pages={pagesCount}
                defaultPageSize={defaultPageSize || 15}
                pageSizeOptions={[defaultPageSize || 15, 20, 25, 30, 40, 50, 100, 500]}
                minRows={!isSimpleTable ? 15 : 0}
                previousText="Предыдущая"
                nextText='Следующая'
                loadingText='Загрузка...'
                noDataText='Нет данных'
                pageText='Стр.'
                ofText='из'
                rowsText="строк"
                showPaginationTop={!isSimpleTable || !defaultPageSize}
                showPaginationBottom={false}
                SubComponent={subComponent && (({original}) => subComponent(original))}
                filtered={filtered}
                defaultFiltered={filtered}
            />
        );
    }

    render() {
        const {
            name, checkedItems, isEditing, onResetChanges,
            onSaveChanges, onRefreshData, isSimpleTable
        } = this.props;
        return (
            isSimpleTable ? this.renderReactTable() :
            <EditableTable tableName={name}
                           checkedItems={checkedItems && checkedItems.map(ci => ci.localId)}
                           onUncheckItems={this.onUncheckRows}
                           onCheckAllItems={this.onCheckAllRows}
                           onRemove={this.onDeleteRows}
                           onEdit={this.onEditRows}
                           isEditMode={isEditing}
                           onCancel={onResetChanges}
                           onDone={onSaveChanges}
                           onRefresh={onRefreshData}
                           onAdd={this.onAddRow}
                           controls={this.controls()}
            >
                {this.renderReactTable()}
                {this.extraContent()}
            </EditableTable>
        )
    }
}
const dataItem = PropTypes.shape({
    localId : PropTypes.string,
    externalId : PropTypes.string,
});
Table.propTypes = {
    name : PropTypes.string,
    data: PropTypes.arrayOf(dataItem),
    checkedItems : PropTypes.arrayOf(dataItem),
    pagesCount: PropTypes.number,
    isFetching : PropTypes.bool,
    isEditing : PropTypes.bool,
    onFetchData: PropTypes.func,
    onChange : PropTypes.func,
    onCheckRow : PropTypes.func,
    onDeleteRow : PropTypes.func,
    onEditRow : PropTypes.func,
    onResetChanges : PropTypes.func,
    onRefreshData : PropTypes.func,
    onSaveChanges : PropTypes.func,
    onAddNewItem : PropTypes.func,
    isSimpleTable : PropTypes.bool,
    subComponent : PropTypes.func,
    defaultPageSize: PropTypes.number,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string})),

    isEditMode : PropTypes.bool,
    defaultSorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool})),
    sorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool})),

};

export default Table;