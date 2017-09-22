/**
 * Table Container
 *
 * Created by Alex Elkin on 14.09.2017.
 */
import EditableTable from '../components/table/EditableTable'
import PersonsContainer from './PersonsContainer'
import BloodDonationsContainer from './BloodDonationsContainer'
import {fetchTableData, addNew, edit, saveChanges, enableEditMode, deleteChecked} from '../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import {connect} from 'react-redux'

class TableContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onAddRow = this.onAddRow.bind(this);
        this.onSaveChanges = this.onSaveChanges.bind(this);
        this.dismissChanges = this.dismissChanges.bind(this);
        this.onEnableEditMode = this.onEnableEditMode.bind(this);
        this.onDeleteCheckedItems = this.onDeleteCheckedItems.bind(this);
    }

    onAddRow() {
        this.props.addNew(this.props.tableName);
    }

    onSaveChanges() {
        this.props.saveChanges(this.props.tableName);
    }

    dismissChanges() {
        this.props.fetchTableData(this.props.tableName);
    }

    onEnableEditMode() {
        this.props.enableEditMode(this.props.tableName);
    }

    onDeleteCheckedItems() {
        this.props.deleteChecked(this.props.tableName);
    }

    render() {
        const {isEditing} = this.props.tableData;
        return (
            <div>
                <EditableTable onAdd={this.onAddRow}
                               onDone={this.onSaveChanges}
                               isEditMode={isEditing}
                               onCancel={this.dismissChanges}
                               onEdit={this.onEnableEditMode}
                               onRemove={this.onDeleteCheckedItems}
                               onRefresh={this.dismissChanges}
                               tableName={this.props.tableDisplayName}
                >
                    <Route path='*/table/persons' component={PersonsContainer}/>
                    <Route path='*/table/bloodDonations' component={BloodDonationsContainer}/>
                </EditableTable>
            </div>
        )
    }
}

TableContainer.propTypes = {
    tableName : PropTypes.string,
    tableDisplayName : PropTypes.string,
    tableData : PropTypes.object,
    addNew : PropTypes.func,
    enableEditMode : PropTypes.func,
    deleteChecked : PropTypes.func,
    fetchTableData : PropTypes.func,
    saveChanges : PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
    const {tableName} = ownProps.match.params;
    return {
        tableName,
        tableDisplayName : state.tables[tableName].displayName,
        tableData: state.tables[tableName]
    }
};

export default connect(mapStateToProps, {addNew, edit, saveChanges, fetchTableData, enableEditMode, deleteChecked})(TableContainer);