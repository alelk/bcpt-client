/**
 * Persons table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Table, {Cell, IconCell, filterById} from './Table'
import EditableLabel from '../editable/EditableLabel'

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/ru';

class PersonsTable extends Table {

    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(value, row, column) {
        this.props.onChange && this.props.onChange(row.externalId, {[column.id] : value});
    }

    columns() {
        return [
            {Header: "", accessor: "localId", Cell: () => IconCell("person"), width: 30, filterable: false},
            {
                Header: "ID",
                accessor: "externalId",
                Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                filterMethod: filterById
            },
            {Header: "Фамилия", accessor: "lastName", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
            {Header: "Имя", accessor: "firstName", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
            {Header: "Отчество", accessor: "middleName", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
            {
                Header: "Группа крови",
                accessor: "bloodType",
                Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                allowedValues: ["", "0(I)", "A(II)", "B(III)", "AB(IV)"],
                Filter: ({filter, onChange}) => <EditableLabel valueSet={["", "0(I)", "A(II)", "B(III)", "AB(IV)"]}
                                                               isEditMode={true} onChange={onChange}/>,
                width: 100
            }, {
                Header: "Rh",
                accessor: "rhFactor",
                Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                allowedValues: ["", "Rh+", "Rh-"],
                Filter: ({filter, onChange}) => <EditableLabel valueSet={["", "Rh+", "Rh-"]} isEditMode={true}
                                                               onChange={onChange}/>,
                width: 100
            },
            {
                Header: "Последнее изменение",
                id: "updateTimestamp",
                accessor: d => moment(d.updateTimestamp).format('YYYY/MM/DD HH:mm'),
                minWidth: 130
            }
        ];
    }
}
PersonsTable.propTypes = {
    data : PropTypes.arrayOf(PropTypes.shape({
        externalId : PropTypes.string,
        firstName : PropTypes.string,
        lastName : PropTypes.string,
        middleName : PropTypes.string,
        groupType : PropTypes.string,
        rhFactor : PropTypes.string,
        updateTimestamp : PropTypes.string,
        errors : PropTypes.object | PropTypes.array
    })).isRequired,
    pagesCount: PropTypes.number,
    isFetching : PropTypes.bool,
    onChange : PropTypes.func,
    onFetchData: PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default PersonsTable;