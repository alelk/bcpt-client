/**
 * Drawer
 *
 * Created by Alex Elkin on 22.09.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import './Drawer.css'

class Drawer extends React.Component {

    constructor(props) {
        super(props);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.state = {
            isOpened : props.isOpenedDefault
        }
    }

    onMenuClick() {
        this.setState({isOpened: !this.state.isOpened})
    }

    render() {
        const {header, children} = this.props;
        return (
            <div className={`Drawer${this.state.isOpened ? ' opened' : ' closed'}`}>
                <i className="material-icons menu" onClick={this.onMenuClick}>menu</i>
                <div className="header">{header}</div>
                <div className="content">{
                    children && children.map((child, key) => <div className="navItem" onClick={this.onMenuClick} key={key}>{child}</div>)
                }</div>
            </div>
        )
    }
}
Drawer.propTypes = {
    header : PropTypes.object,
    isOpenedDefault : PropTypes.bool
};
export default Drawer;