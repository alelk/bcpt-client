/**
 * Persons Container
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import PersonsTable from '../../components/table/PersonsTable'
import TableContainerAdapter, {mapStateToProps, mapDispatchToProps} from './TableContainerAdapter'

import React from 'react'
import {connect} from 'react-redux'

class PersonsContainer extends TableContainerAdapter {
    render() {
        return (
            <PersonsTable {...this.tableProps()}/>
        )
    }
}

export default connect(mapStateToProps("persons"), mapDispatchToProps)(PersonsContainer);