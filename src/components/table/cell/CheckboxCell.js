/**
 * Checkbox Cell
 *
 * Created by Alex Elkin on 16.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import CheckboxInput from '../input/CheckBoxInput'
import {onCellChange} from './util'

const CheckboxCell = ({value, column, row, original}) => {
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}`}>
            <CheckboxInput
                value={value}
                onChange={(value) => onCellChange(value, column, row)}
            />
        </div>
    )
};

CheckboxCell.propTypes = {
    original : PropTypes.shape({
        localId: PropTypes.string,
        isEditing: PropTypes.bool
    }),
    column : PropTypes.shape({
        isEditable : PropTypes.bool,
        onChange : PropTypes.func
    }),
    value : PropTypes.string
};

export default CheckboxCell;