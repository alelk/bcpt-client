/**
 * Uploads Table
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import prettyBytes from 'pretty-bytes'
import FontIcon from 'material-ui/FontIcon';

class UploadsTable extends React.Component {

    columns() {
        const {onDownload} = this.props;
        return [
            {
                Header: "Имя файла",
                accessor: "fileName"
            }, {
                Header: "Размер",
                id: "fileSize",
                accessor: row => row.fileSize && prettyBytes(row.fileSize)
            }, {
                Header: "Последнее изменение",
                id: "lastModified",
                accessor: row => new Date(row.lastModified).toLocaleString()
            }, {
                Header: "Загружен",
                id: "isFetching",
                accessor: row => (<FontIcon className="material-icons">{row.isFetching ? '' : 'done'}</FontIcon>),
                width: 100
            },
            onDownload && {
                Header: "Скачать",
                id: "download",
                accessor: row => (
                    <FontIcon onClick={() => onDownload(row.fileName)} className="material-icons">
                        {row.isFetching ? '' : 'file_download'}
                    </FontIcon>
                ),
                width: 100
            }
        ];
    }

    render() {
        const {data, isFetching} = this.props;
        return (
            <ReactTable data={data}
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

UploadsTable.propTypes = {
    data : PropTypes.arrayOf(fileType),
    isFetching : PropTypes.bool,
    onDownload : PropTypes.func
};

export default UploadsTable;