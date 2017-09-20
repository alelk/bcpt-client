/**
 * Persons table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Table, {Cell} from './Table'

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/ru';

class PersonsTable extends React.Component {

    columns = [
        { Header: "ID", accessor: "externalId", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
        { Header: "Фамилия", accessor: "lastName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        { Header: "Имя", accessor: "firstName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        { Header: "Отчество", accessor: "middleName", Cell: (ci) => Cell(ci, this.props.onChange, "localId") },
        {
            Header: "Группа крови",
            accessor: "bloodType",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            allowedValues: ["", "0(I)", "A(II)", "B(III)", "AB(IV)"],
            width: 100
        },
        {
            Header: "Rh",
            accessor: "rhFactor",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            allowedValues: ["", "Rh+", "Rh-"],
            width: 100
        },
        {
            Header: "Последнее изменение",
            id: "updateTimestamp",
            accessor: d => moment(d.updateTimestamp).format('YYYY/MM/DD HH:mm'),
            width: 130
        }
    ];

    render() {
        const {persons, isEditMode} = this.props;
        const data = Object.keys(persons).map(k => Object.assign({}, persons[k], {localId: k})).filter(item => !item.isDeleted);
        return (
            <Table
                defaultSorted={[{id:"localId", desc:true}]}
                sorted={isEditMode ? [{id:"localId", desc:true}] : undefined}
                data={data}
                filterable={true}
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
        rhFactor : PropTypes.string
    })).isRequired,
    isEditMode : PropTypes.bool,
    onChange : PropTypes.func
};

export default PersonsTable;