/**
 * Uploads Table
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";

class UploadsTable extends React.Component {

    columns = [
        {
            Header: "",
            accessor: "isFetching",
            width: 30
        },{
            Header: "Имя файла",
            accessor: "fileName"
        },{
            Header: "Размер",
            accessor: "fileSize"
        },{
            Header: "Последнее изменение",
            accessor: "lastModified"
        },
    ];

    render() {
        const {data, isFetching} = this.props;
        return (
            <ReactTable data={data}
                        loading={isFetching}
                        columns={this.columns}
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
    isFetching : PropTypes.bool
};

export default UploadsTable;