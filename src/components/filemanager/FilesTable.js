/**
 * Uploads Table
 *
 * Created by Alex Elkin on 02.11.2017.
 */
import DateTimeLabel from '../table/label/DateTimeLabel'
import './FilesTable.css'

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import prettyBytes from 'pretty-bytes'
import FontIcon from 'material-ui/FontIcon';

const iconCellStyle = {
    textAlign: "center",
};

class FilesTable extends React.Component {

    columns() {
        const {onDownload, onRemove} = this.props;
        return [
            {
                id: "icon",
                style: iconCellStyle,
                accessor: row => (<FontIcon className="material-icons">insert_drive_file</FontIcon>),
                width: 50,
                sortable: false
            },{
                Header: "Имя файла",
                accessor: "fileName",
                filterable: true
            }, {
                Header: "Размер",
                id: "fileSize",
                accessor: row => row.fileSize && prettyBytes(row.fileSize),
                filterable: true

            }, {
                Header: "Последнее изменение",
                accessor: "lastModified",
                Cell: ({value}) => <DateTimeLabel value={value} type="datetime-local"/>,
                filterable: true
            }, {
                Header: "Загружен",
                id: "isFetching",
                style: iconCellStyle,
                accessor: row => (<FontIcon className="material-icons">{row.isFetching ? '' : 'done'}</FontIcon>),
                width: 90,
                sortable: false
            },
            onDownload && {
                Header: "Скачать",
                id: "download",
                style: iconCellStyle,
                accessor: row => (
                    <FontIcon onClick={(e) => {e.stopPropagation(); onDownload(row.fileName)}} className="material-icons actionBtn">
                        {row.isFetching ? '' : 'file_download'}
                    </FontIcon>
                ),
                width: 90,
                sortable: false
            },
            onRemove && {
                Header: "Удалить",
                id: "remove",
                style: iconCellStyle,
                accessor: row => (
                    <FontIcon onClick={(e) => {e.stopPropagation(); onRemove(row.fileName)}} className="material-icons actionBtn">
                        {row.isFetching ? '' : 'remove'}
                    </FontIcon>
                ),
                width: 90,
                sortable: false
            }
        ];
    }

    render() {
        const {data, isFetching, onFileSelect} = this.props;
        return (
            <ReactTable data={data}
                        className="FilesTable"
                        loading={isFetching}
                        columns={this.columns()}
                        defaultPageSize={5}
                        pageSizeOptions={[5, 20, 25, 30, 40, 50, 100, 500]}
                        minRows={5}
                        previousText="Предыдущая"
                        nextText='Следующая'
                        loadingText='Загрузка...'
                        noDataText='Нет данных'
                        pageText='Стр.'
                        ofText='из'
                        rowsText="строк"
                        showPaginationTop
                        showPaginationBottom={false}
                        getTrProps={(state, rowInfo) => {
                            if (!(rowInfo && rowInfo.original)) return {};
                            return {
                                onClick: (e, handleOriginal) => {
                                    onFileSelect && onFileSelect(rowInfo.original.fileName, rowInfo.original);
                                    if (handleOriginal) handleOriginal()
                                },
                                className: onFileSelect ? "clickableRow" : ""
                            }
                        }}
            />
        )
    }
}

export const fileType = PropTypes.shape({
    fileName : PropTypes.string,
    fileSize : PropTypes.number,
    lastModified : PropTypes.string,
    isFetching : PropTypes.bool
});

FilesTable.propTypes = {
    data : PropTypes.arrayOf(fileType),
    isFetching : PropTypes.bool,
    onFileSelect : PropTypes.func,
    onDownload : PropTypes.func,
    onRemove : PropTypes.func
};

export default FilesTable;