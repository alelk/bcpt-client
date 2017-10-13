/**
 * Persons Container
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import PersonsTable from '../components/table/PersonsTable'
import {fetchTableData, edit} from '../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class PersonsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onFetchData = this.onFetchData.bind(this);
    }

    onFetchData(pageNumber, itemsPerPage, sorted, filtered) {
        this.props.fetchTableData("persons", pageNumber, itemsPerPage, sorted, filtered)
    }

    render() {
        const {table, pages, items, isEditMode, edit, filters} = this.props;
        const page = table && pages && pages[table.pageNumber];

        console.log("page:", page);

        return (
            <PersonsTable data={page && page.items && page.items.map(item => items[item])}
                          pagesCount={page && page.pagesCount}
                          isEditMode={isEditMode}
                          isFetching={page && page.isFetching}
                          onChange={(localId, changes) => edit("persons", localId, changes)}
                          filters={filters}
                          onFetchData={this.onFetchData}
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
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    table: state.tables["persons"],
    pages: state.tablePages["persons"],
    items: state.tableItems["persons"],
    isEditMode: state.tables["persons"].isEditing
});

export default connect(mapStateToProps, {fetchTableData, edit})(PersonsContainer);