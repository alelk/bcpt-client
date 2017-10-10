/**
 * Date and Time Cell
 *
 * Created by Alex Elkin on 09.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import DateTimeEditable from '../../editable/DateTimeEditable'
import {onCellChange} from './util'

const DateTimeCell = (props) => {
    const {value, column, original, row} = props;
    return (
        <DateTimeEditable inputType={column.inputType}
                       value={value}
                       onChange={(value) => onCellChange(value, column, row)}
                       isEditMode={original.isEditing && column.isEditable}
        />
    )

};


DateTimeCell.propTypes = {
    original : PropTypes.shape({
        isEditing: PropTypes.bool
    }),
    column : PropTypes.shape({
        inputType : PropTypes.oneOf(["datetime-local", "date", "time"]),
        isEditable : PropTypes.bool,
        onChange : PropTypes.func
    }),
    value : PropTypes.string
};

export default DateTimeCell;