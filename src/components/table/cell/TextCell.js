/**
 * Text Cell
 *
 * Created by Alex Elkin on 10.10.2017.
 */
import Input from '../input/Input'
import {onCellChange, getErrorIfExists} from './util'
import './Cell.css'

import React from 'react'
import PropTypes from 'prop-types';

const TextCell = ({value, column, original, row}) => {
    const error = getErrorIfExists(original, column);
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}`}>
            {
                original.isEditing && column.isEditable
                    ? <Input inputType={column.inputType} value={value}
                             onChange={(value) => onCellChange(value, column, row)}
                             error={error}/>
                    : <label>{value}</label>
            }
        </div>
    )
};

TextCell.propTypes = {
    original : PropTypes.shape({
        localId: PropTypes.string,
        isEditing: PropTypes.bool,
        isDeleted: PropTypes.bool,
        errors: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            defaultMessage: PropTypes.string
        }))
    }),
    column : PropTypes.shape({
        id : PropTypes.string,
        inputType : PropTypes.oneOf(["text", "number"]),
        isEditable : PropTypes.bool,
        onChange : PropTypes.func
    }),
    value : PropTypes.string,
    row: PropTypes.object
};

export default TextCell;