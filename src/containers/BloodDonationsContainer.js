/**
 * Blood Donations Container
 *
 * Created by Alex Elkin on 21.09.2017.
 */

import BloodDonationsTable from '../components/table/BloodDonationsTable'
import {fetchTableData, edit} from '../actions/actions'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

class BloodDonationsContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (Object.keys(this.props.bloodDonations).length <= 0)
            this.props.fetchTableData("bloodDonations");
    }

    render() {
        const {bloodDonations, isEditMode, edit} = this.props;
        return (
            <BloodDonationsTable bloodDonations={bloodDonations}
                          isEditMode={isEditMode}
                          onChange={(localId, changes) => edit("bloodDonations", localId, changes)}
            />
        )
    }
}

BloodDonationsContainer.propTypes = {
    bloodDonations : PropTypes.object,
    fetchTableData : PropTypes.func,
    isEditMode : PropTypes.bool,
    edit : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    bloodDonations: state.tables["bloodDonations"].data,
    isEditMode: state.tables["bloodDonations"].isEditing
});

export default connect(mapStateToProps, {fetchTableData, edit})(BloodDonationsContainer);