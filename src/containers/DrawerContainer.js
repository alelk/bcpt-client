/**
 * Drawer Container
 *
 * Created by Alex Elkin on 22.09.2017.
 */
import Drawer from '../components/Drawer'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const DrawerContainer = ({header, children}) => {
    return (
        <Drawer header={header}>{children}</Drawer>
    )
};
DrawerContainer.propTypes = {
    header : PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
    header: ownProps.header
});

export default connect(mapStateToProps, undefined)(DrawerContainer);