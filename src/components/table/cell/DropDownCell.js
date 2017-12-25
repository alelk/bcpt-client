/**
 * Drop Down input Cell
 *
 * Created by Alex Elkin on 18.10.2017.
 */

import DropDownInput from '../input/DropDownInput'
import {onCellChange} from './util'
import './Cell.css'

import React from 'react'
import PropTypes from 'prop-types';

const valueFor = (allowedValues, value) => {
    const v = allowedValues && allowedValues.find(av => av.value === value || av.displayValue === value);
    return v && v.value;
};

const displayValueFor = (allowedValues, value) => {
    const v = allowedValues && allowedValues.find(av => av.value === value || av.displayValue === value);
    return v && v.displayValue;
};

const DropDownCell = ({value, column, original, row}) => {
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}`}>
            {
                original.isEditing && column.isEditable
                    ? <DropDownInput value={valueFor(column.allowedValues, value)} allowedValues={column.allowedValues}
                             onChange={(value) => onCellChange(value, column, row)}/>
                    : <label>{displayValueFor(column.allowedValues, value)}</label>
            }
        </div>
    )
};

DropDownCell.propTypes = {
    original : PropTypes.shape({
        localId: PropTypes.string,
        isEditing: PropTypes.bool,
        isDeleted: PropTypes.bool
    }),
    column : PropTypes.shape({
        type : PropTypes.oneOf(["text", "number"]),
        isEditable : PropTypes.bool,
        onChange : PropTypes.func,
        allowedValues : PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            displayValue: PropTypes.string
        })),
    }),
    value : PropTypes.string,
    row: PropTypes.object
};

export default DropDownCell;