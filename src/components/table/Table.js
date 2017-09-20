/**
 * Table
 *
 * Created by Alex Elkin on 14.09.2017.
 */
import EditableLabel from '../EditableLabel'

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./Table.css"

export const Cell = (cellInfo, onChange, keyName) => (
    <EditableLabel key={cellInfo.original[keyName]} value={cellInfo.value}
                   valueSet={cellInfo.column.allowedValues}
                   inputType={cellInfo.column.inputType}
                   isEditMode={cellInfo.original.isEditing}
                   onChange={(value) => onChange && onChange(cellInfo.original[keyName], {[cellInfo.column.id]: value})}
                   error={ cellInfo.original.errors
                       ? cellInfo.original.errors.find(error => error.field === cellInfo.column.id)
                       : null
                   }
    />
);

const Table = ({data, columns, defaultSorted, sorted}) => {
    return (
        <ReactTable
            defaultSorted = {defaultSorted || []}
            sorted = {sorted}
            data={data}
            filterable={true}
            columns={columns}
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
};
Table.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    isEditMode : PropTypes.bool,
    defaultSorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool})),
    sorted : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, desc:PropTypes.bool}))
};

export default Table;