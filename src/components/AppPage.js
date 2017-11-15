/**
 * Home Page Container
 *
 * Created by Alex Elkin on 15.11.2017.
 */
import './AppPage.css'

import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar';

class AppPage extends React.Component {

    render() {
        const {
            onDrawerChangeDrawerVisibilityRequest, className, title, children
        } = this.props;
        return (
            <div className={`AppPage${className?' ' + className:''}`}>
                <AppBar className="AppBar" onLeftIconButtonTouchTap={onDrawerChangeDrawerVisibilityRequest}
                        title={title}/>
                <div className="content">
                    {children}
                </div>
            </div>
        )
    }
}
AppPage.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
};

export default AppPage;