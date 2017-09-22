/**
 * Blood Donations Table
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import Table, {Cell, IconCell} from './Table'

import React from 'react'
import PropTypes from 'prop-types'

class BloodDonationsTable extends React.Component {

    columns = [
        {Header: "", accessor: "localId", Cell: () => IconCell("invert_colors"), width: 30, filterable: false },
        {Header: "ID", accessor: "externalId", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
        {Header: "ID донора", accessor: "donorExternalId", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
        {Header: "Объём", accessor: "amount", Cell: (ci) => Cell(ci, this.props.onChange, "localId")},
        {
            Header: "Дата изготовления",
            accessor: "donationDate",
            inputType: 'date',
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        }, {
            Header: "Начало карантина",
            accessor: "quarantineDate",
            inputType: 'date',
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        }, {
            Header: "Последнее изменение",
            accessor: "updateTimestamp",
            inputType: 'datetime',
            minWidth: 130,
            isEditable: false,
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        }
    ];

    render() {
        const {bloodDonations, isEditMode} = this.props;
        const data = Object.keys(bloodDonations).map(k => Object.assign({}, bloodDonations[k], {localId: k}));
        return (
            <Table
                defaultSorted={[{id: "localId", desc: false}]}
                sorted={isEditMode ? [{id: "localId", desc: false}] : undefined}
                data={data}
                filterable={true}
                columns={isEditMode ? [{
                        Header: "", accessor: "isChecked",
                        Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
                        inputType: 'checkbox', width: 30
                    }
                        , ...this.columns] : this.columns
                }
            />
        )
    }
}
BloodDonationsTable.propTypes = {
    bloodDonations : PropTypes.objectOf(PropTypes.shape({
        externalId : PropTypes.string,
        amount : PropTypes.number,
        donationDate : PropTypes.string,
        quarantineDate : PropTypes.string,
        updateTimestamp : PropTypes.string,
        errors : PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    })).isRequired,
    isEditMode : PropTypes.bool,
    onChange : PropTypes.func
};

export default BloodDonationsTable;