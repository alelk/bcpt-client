/**
 * Table
 *
 * Created by Alex Elkin on 14.09.2017.
 */
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
            this.columnsData = [
                {accessor: "isChecked", inputType:'checkbox', width: 30},
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

    render() {
        const {data, pagesCount, isFetching} = this.props;
        return (
            <ReactTable
                data={data}
                manual
                onFetchData={this.onFetchData}
                loading = {isFetching}
                columns={this._columns()}
                pages={pagesCount}
                defaultPageSize={15}
                pageSizeOptions={[15, 20, 25, 30, 40, 50, 100, 500]}
                minRows={15}
                previousText="Предыдущая"
                nextText='Следующая'
                loadingText='Загрузка...'
                noDataText='Нет данных'
                pageText='Стр.'
                ofText='из'
                rowsText="строк"
                showPaginationTop
                showPaginationBottom={false}
            />
        )
    }
}

Table.propTypes = {
    data: PropTypes.array.isRequired,
    pagesCount: PropTypes.number,
    isFetching : PropTypes.bool,
    onFetchData: PropTypes.func,

    isEditMode : PropTypes.bool,
    defaultSorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool})),
    sorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool})),
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string})),

};

export default Table;