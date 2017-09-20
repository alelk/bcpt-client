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
    }

    componentWillMount() {
        if (Object.keys(this.props.persons).length <= 0)
            this.props.fetchTableData("persons");
    }

    render() {
        const {persons, isEditMode, edit} = this.props;
        return (
            <PersonsTable persons={persons}
                          isEditMode={isEditMode}
                          onChange={(localId, changes) => edit("persons", localId, changes)}
            />
        )
    }
}

PersonsContainer.propTypes = {
    persons : PropTypes.object,
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    persons: state.tables["persons"].data,
    isEditMode: state.tables["persons"].isEditing
});

export default connect(mapStateToProps, {fetchTableData, edit})(PersonsContainer);