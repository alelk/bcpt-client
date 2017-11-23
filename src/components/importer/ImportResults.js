/**
 * Import Results
 *
 * Created by Alex Elkin on 14.11.2017.
 */

import ImportDetailedResultDialog from './dialog/ImportDetailedResultDialog'
import DateTimeLabel from '../table/label/DateTimeLabel'
import './ImportResults.css';

import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import "react-table/react-table.css";
import FontIcon from 'material-ui/FontIcon';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';

const iconCellStyle = {
    textAlign: "center",
};

const stateIcon = (row) => {
    let color;
    let iconName;
    if (/success/i.test(row.processState)) {
        color = "#00a941";
        iconName = "done";
    } else if (/failed/i.test(row.processState)) {
        color = "#ff3f36";
        iconName = "error";
    } else if (/warning/i.test(row.processState)) {
        color = "#ff9300";
        iconName = "warning";
    } else {
        color = "#0048ff";
        iconName = "loop";
    }
    return (
        <FontIcon className="material-icons" color={color}>{iconName}</FontIcon>
    )
};

class ImportResults extends React.Component {

    constructor(props) {
        super(props);
        this.closeImportResultDialog = this.closeImportResultDialog.bind(this);
        this.onImportResultClick = this.onImportResultClick.bind(this);
        this.state = {
            isImportResultDialogOpened: false,
            importResult: {}
        }
    }

    closeImportResultDialog() {
        this.setState({isImportResultDialogOpened: false})
    }

    onImportResultClick(importResult) {
        this.setState({isImportResultDialogOpened: true, importResult})
    }

    columns() {
        return [
            {
                Header: "Состояние",
                id: "result",
                style: iconCellStyle,
                accessor: stateIcon,
                width: 90,
            }, {
                Header: "Имя файла",
                accessor: "fileName",
                filterable: true
            }, {
                Header: "Статус",
                accessor: "operationName",
            }, {
                Header: "Завершено",
                id: "progress",
                accessor: (row) => (<LinearProgress mode="determinate" value={row.progress ? parseInt(row.progress, 10) : 0}/>),
                minWidth: 200
            }, {
                Header: "Временная метка",
                accessor: "importTimestamp",
                Cell: ({value}) => <DateTimeLabel value={value} type="datetime-local"/>,
                filterable: true
            },
        ];
    }

    render() {
        const {imports, isFetching, title, subtitle} = this.props;
        return (
            <Card className="ImportResults">
                <CardTitle title={title} subtitle={subtitle}/>
                <CardText>
                    <ReactTable data={imports}
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
                                defaultSorted={[{key:"importTimestamp",desc:true}]}
                                getTrProps={(state, rowInfo) => {
                                    if (!(rowInfo && rowInfo.original)) return {};
                                    return {
                                        onClick: (e, handleOriginal) => {
                                            this.onImportResultClick(rowInfo.original);
                                            if (handleOriginal) handleOriginal()
                                        },
                                        className: "clickableRow"
                                    }
                                }}
                    />
                </CardText>
                <ImportDetailedResultDialog
                    open={this.state.isImportResultDialogOpened}
                    title={`Результаты импорта файла ${this.state.importResult.fileName}`}
                    onRequestClose={this.closeImportResultDialog}
                    importResult={imports.find(importResult => importResult.importProcessId === this.state.importResult.importProcessId)}
                />
            </Card>
        )
    }
}
export const importResultType = PropTypes.shape({
    importProcessId: PropTypes.string,
    fileName : PropTypes.string,
    operationName : PropTypes.string,
    importTimestamp : PropTypes.string,
    progress: PropTypes.number,
    processState: PropTypes.oneOf(["SUCCESS", "IN_PROGRESS", "FAILED", "WITH_WARNINGS"]),
    errors: PropTypes.array,
    countPersons: PropTypes.number,
    countBloodDonations: PropTypes.number,
    countBloodInvoices: PropTypes.number,
    countBloodPools: PropTypes.number,
    countProductBatches: PropTypes.number,
});
ImportResults.propTypes = {
    imports : PropTypes.arrayOf(importResultType),
    isFetching : PropTypes.bool,
    title : PropTypes.string,
    subtitle : PropTypes.string,
};
export default ImportResults;