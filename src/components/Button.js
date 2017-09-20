/**
 * Button
 *
 * Created by Alex Elkin on 13.07.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import './Button.css'

const Button = ({className, iconName, onClick, children}) => {
    return (
        <button className={`Button ${className || ''}`.trim()} onClick={onClick}>
            {iconName && <i className='material-icons icon'>{iconName}</i>}
            {children}
        </button>
    );
};

Button.propTypes = {
    className : PropTypes.string,
    iconName : PropTypes.string,
    onClick : PropTypes.func
};

export default Button;