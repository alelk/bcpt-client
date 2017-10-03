/**
 * Persons table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Table, {Cell, IconCell, filterById} from './Table'
import EditableLabel from '../EditableLabel'

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/ru';

class PersonsTable extends React.Component {

    columns = [
        { Header: "", accessor: "localId", Cell: () => IconCell("person"), width: 30, filterable: false },
        {
            Header: "ID",
            accessor: "externalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            filterMethod: filterById
        },
        { Header: "Фамилия", accessor: "lastName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        { Header: "Имя", accessor: "firstName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        { Header: "Отчество", accessor: "middleName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        {
            Header: "Группа крови",
            accessor: "bloodType",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            allowedValues: ["", "0(I)", "A(II)", "B(III)", "AB(IV)"],
            Filter: ({ filter, onChange }) => <EditableLabel valueSet={["", "0(I)", "A(II)", "B(III)", "AB(IV)"]} isEditMode={true} onChange={onChange}/>,
            width: 100
        },
        {
            Header: "Rh",
            accessor: "rhFactor",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            allowedValues: ["", "Rh+", "Rh-"],
            Filter: ({ filter, onChange }) => <EditableLabel valueSet={["", "Rh+", "Rh-"]} isEditMode={true} onChange={onChange}/>,
            width: 100
        },
        {
            Header: "Последнее изменение",
            id: "updateTimestamp",
            accessor: d => moment(d.updateTimestamp).format('YYYY/MM/DD HH:mm'),
            minWidth: 130
        }
    ];

    render() {
        const {persons, isEditMode, isFetching, filters} = this.props;
        const data = Object.keys(persons).map(k => Object.assign({}, persons[k], {localId: k}));
        return (
            <Table
                defaultSorted={[{id:"localId", desc:false}]}
                sorted={isEditMode ? [{id:"localId", desc:false}] : undefined}
                data={data}
                filterable={true}
                filters={filters}
                isFetching={isFetching}
                columns={isEditMode ? [{
                    Header: "", accessor: "isChecked",
                        Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                        inputType:'checkbox', width: 30}
                        ,...this.columns] : this.columns
                }
            />
        )
    }
}
PersonsTable.propTypes = {
    persons : PropTypes.objectOf(PropTypes.shape({
        externalId : PropTypes.string,
        firstName : PropTypes.string,
        lastName : PropTypes.string,
        middleName : PropTypes.string,
        groupType : PropTypes.string,
        rhFactor : PropTypes.string,
        updateTimestamp : PropTypes.string,
        errors : PropTypes.object | PropTypes.array
    })).isRequired,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    onChange : PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default PersonsTable;