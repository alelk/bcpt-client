/**
 * Text filter
 *
 * Created by Alex Elkin on 16.10.2017.
 */
import Input from '../input/Input'
import './Filter.css'

import React from 'react'
import PropTypes from 'prop-types';

const TextFilter = ({filter, onChange}) => {
    return (
        <Input inputType="text"
                  value={filter ? filter.value : ''}
                  onChange={onChange}
        />
    )
};

TextFilter.propTypes = {
    filter : PropTypes.shape({
        value: PropTypes.oneOf([PropTypes.number, PropTypes.string])
    }),
    onChange : PropTypes.func
};

export default TextFilter;