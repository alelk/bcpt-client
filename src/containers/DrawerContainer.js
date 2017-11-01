/**
 * Drawer Container
 *
 * Created by Alex Elkin on 22.09.2017.
 */
import {changeDrawerState} from '../actions/actions'
import './DrawerContainer.css'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Drawer from 'material-ui/Drawer';

class DrawerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onRequestVisibilityChange = this.onRequestVisibilityChange.bind(this);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.renderChildren = this.renderChildren.bind(this);
    }

    onRequestVisibilityChange(isDrawerOpened) {
        this.props.changeDrawerState({isDrawerOpened})
    }

    onMenuItemSelected() {
        this.props.changeDrawerState({isDrawerOpened:false})
    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, {onClick: this.onMenuItemSelected, className: 'navItem'})
        )
    }

    render() {
        const {isDrawerOpened, children} = this.props;
        return (
            <Drawer className="Drawer" open={isDrawerOpened} docked={false} onRequestChange={this.onRequestVisibilityChange}>
                {this.renderChildren()}
            </Drawer>
        )
    }
}

DrawerContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState : PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened
});

export default connect(mapStateToProps, {changeDrawerState})(DrawerContainer);