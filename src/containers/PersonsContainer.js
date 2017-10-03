/**
 * Persons Container
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import PersonsTable from '../components/table/PersonsTable'
import {fetchTableData, edit} from '../actions/actions'
import {urlQueryAsFilters} from '../components/table/Table'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class PersonsContainer extends React.Component {

    componentWillMount() {
        if (Object.keys(this.props.persons).length <= 0)
            this.props.fetchTableData("persons");
    }

    render() {
        const {persons, isEditMode, edit, isFetching, location} = this.props;
        return (
            <PersonsTable persons={persons}
                          isEditMode={isEditMode}
                          isFetching={isFetching}
                          onChange={(localId, changes) => edit("persons", localId, changes)}
                          filters={urlQueryAsFilters(location.search)}
            />
        )
    }
}

PersonsContainer.propTypes = {
    persons : PropTypes.object,
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    isFetching : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    persons: state.tables["persons"].data,
    isEditMode: state.tables["persons"].isEditing,
    isFetching: state.tables["persons"].isFetching
});

export default connect(mapStateToProps, {fetchTableData, edit})(PersonsContainer);