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

    componentWillMount() {
        if (Object.keys(this.props.persons).length <= 0)
            this.props.fetchTableData("persons");
    }

    render() {
        const {persons, isEditMode, edit, isFetching, filters} = this.props;
        return (
            <PersonsTable persons={persons}
                          isEditMode={isEditMode}
                          isFetching={isFetching}
                          onChange={(localId, changes) => edit("persons", localId, changes)}
                          filters={filters}
            />
        )
    }
}

PersonsContainer.propTypes = {
    persons : PropTypes.object,
    filters : PropTypes.arrayOf(PropTypes.shape({id : PropTypes.string, value : PropTypes.string})),
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    persons: state.tables["persons"].data,
    filters: state.tableFilters["persons"],
    isEditMode: state.tables["persons"].isEditing,
    isFetching: state.tables["persons"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, edit})(PersonsContainer);