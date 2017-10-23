/**
 * Persons Container
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import PersonsTable from '../components/table/PersonsTable'
import {
    fetchTableData, tableRowChange, checkTableRow, deleteTableRow, editTableRow,
    resetTableChanges, saveChanges, tableRowCreate
} from '../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class PersonsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onFetchData = this.onFetchData.bind(this);
    }

    onFetchData(pageNumber, itemsPerPage, sorted, filtered) {
        this.props.fetchTableData("persons", pageNumber, itemsPerPage, sorted, filtered);
    }

    render() {
        const {
            table, pages, items, isEditMode, tableRowChange, checkTableRow, filters,
            deleteTableRow, editTableRow, resetTableChanges, saveChanges, tableRowCreate
        } = this.props;
        const page = table && pages && pages[table.pageNumber];

        console.log("page:", page);

        return (
            <PersonsTable name={table.displayName}
                          data={page && page.items && page.items.map(localId => Object.assign({localId}, items[localId]))}
                          checkedItems={
                              Array.isArray(table.checkedItems) &&
                              table.checkedItems.map(localId => Object.assign({localId}, items[localId])) || undefined
                          }
                          pagesCount={page && page.pagesCount}
                          isEditing={isEditMode}
                          isFetching={page && page.isFetching}
                          onChange={(localId, changes) => tableRowChange("persons", localId, changes)}
                          onCheckRow={(localId, changes) => checkTableRow("persons", localId, changes)}
                          onDeleteRow={(localId) => deleteTableRow("persons", localId)}
                          onEditRow={(localId) => editTableRow("persons", localId)}
                          filters={filters}
                          onFetchData={this.onFetchData}
                          onResetChanges={() => resetTableChanges("persons")}
                          onRefreshData={() => resetTableChanges("persons")}
                          onSaveChanges={() => saveChanges("persons")}
                          onAddNewItem={() => tableRowCreate("persons")}
            />
        )
    }
}

PersonsContainer.propTypes = {
    table : PropTypes.object,
    pages : PropTypes.object,
    items : PropTypes.object,
    filters : PropTypes.arrayOf(PropTypes.shape({id : PropTypes.string, value : PropTypes.string})),
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    tableRowChange : PropTypes.func,
    checkTableRow : PropTypes.func,
    deleteTableRow : PropTypes.func,
    editTableRow : PropTypes.func,
    resetTableChanges: PropTypes.func,
    tableRowCreate: PropTypes.func,
    saveChanges: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    table: state.tables["persons"],
    pages: state.tablePages["persons"],
    items: state.tableItems["persons"],
    isEditMode: state.tables["persons"].isEditing
});

export default connect(mapStateToProps, {
    fetchTableData, tableRowChange, checkTableRow, deleteTableRow,
    editTableRow, resetTableChanges, saveChanges, tableRowCreate
})(PersonsContainer);