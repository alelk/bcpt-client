/**
 * Blood Donations Table
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import Table, {Cell, IconCell, filterById} from './Table'
import EditableLabel from '../editable/EditableLabel'

import React from 'react'
import PropTypes from 'prop-types'

class BloodDonationsTable extends React.Component {

    columns = [
        {Header: "", accessor: "localId", Cell: () => IconCell("invert_colors"), width: 30, filterable: false },
        {
            Header: "Штрих-код",
            accessor: "externalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            filterMethod: filterById
        }, {
            Header: "ID донора",
            accessor: "donorExternalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onDonorClick),
            filterMethod: filterById
        }, {
            Header: "Номер накладной",
            accessor: "bloodInvoiceExternalId",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId", this.props.onBloodInvoiceClick),
            filterMethod: filterById
        }, {
            Header: "Тип донации",
            accessor: "donationType",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId"),
            allowedValues: ["", "plasma-fresh-frozen"],
            Filter: ({ filter, onChange }) => <EditableLabel valueSet={["", "plasma-fresh-frozen"]} isEditMode={true} onChange={onChange}/>,
            width: 100
        }, {
            Header: "Объём, мл",
            accessor: "amount",
            Cell: (ci) => Cell(ci, this.props.onChange, "localId")
        }, {
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
        const {bloodDonations, isEditMode, isFetching, filters} = this.props;
        const data = Object.keys(bloodDonations).map(k => Object.assign({}, bloodDonations[k], {localId: k}));
        return (
            <Table
                defaultSorted={[{id: "localId", desc: false}]}
                sorted={isEditMode ? [{id: "localId", desc: false}] : undefined}
                data={data}
                filterable={true}
                isFetching={isFetching}
                filters={filters}
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
    isFetching : PropTypes.bool,
    isEditMode : PropTypes.bool,
    onChange : PropTypes.func,
    onDonorClick : PropTypes.func,
    onBloodInvoiceClick : PropTypes.func,
    filters : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodDonationsTable;