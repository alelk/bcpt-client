/**
 * Text Cell
 *
 * Created by Alex Elkin on 10.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import Editable from '../../editable/Editable'
import {onCellChange} from './util'

const TextCell = (props) => {
    const {value, column, original, row} = props;
    return (
        <Editable inputType={column.inputType}
                  value={value}
                  onChange={(value) => onCellChange(value, column, row)}
                  isEditMode={original.isEditing && column.isEditable}
        />
    )
};


TextCell.propTypes = {
    original : PropTypes.shape({
        isEditing: PropTypes.bool
    }),
    column : PropTypes.shape({
        inputType : PropTypes.oneOf(["text", "number"]),
        isEditable : PropTypes.bool,
        onChange : PropTypes.func
    }),
    value : PropTypes.string
};

export default TextCell;