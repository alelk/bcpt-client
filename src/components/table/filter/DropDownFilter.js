/**
 * Drop Down Filter
 *
 * Created by Alex Elkin on 16.10.2017.
 */

import DropDownInput from '../input/DropDownInput'
import './Filter.css'

import React from 'react'
import PropTypes from 'prop-types';

const DropDownFilter = ({filter, column, onChange}) => {
    return (
        <DropDownInput inputType="text"
                       value={filter ? filter.value : ''}
                       onChange={onChange}
                       allowedValues={column.allowedValues}
        />
    )
};
DropDownFilter.propTypes = {
    column: PropTypes.shape({
        allowedValues : PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            displayValue: PropTypes.string
        }))
    }),
    filter : PropTypes.shape({
        value: PropTypes.oneOf([PropTypes.number, PropTypes.string])
    }),
    onChange : PropTypes.func
};

export default DropDownFilter;