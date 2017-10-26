/**
 * Date and Time Cell
 *
 * Created by Alex Elkin on 09.10.2017.
 */

import DateTimeInput from '../input/DateTimeInput'
import DateTimeLabel from '../label/DateTimeLabel'

import React from 'react'
import PropTypes from 'prop-types';
import {onCellChange} from './util'
import './Cell.css'

const DateTimeCell = ({value, column, original, row}) => {
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}`}>
            {
                original.isEditing && column.isEditable
                    ? <DateTimeInput inputType={column.inputType} value={value}
                             onChange={(value) => onCellChange(value, column, row)}/>
                    : <DateTimeLabel value={value} inputType={column.inputType}/>
            }
        </div>
    )
};


DateTimeCell.propTypes = {
    original : PropTypes.shape({
        localId: PropTypes.string,
        isEditing: PropTypes.bool,
        isDeleted: PropTypes.bool
    }),
    column : PropTypes.shape({
        inputType : PropTypes.oneOf(["datetime-local", "date", "time"]),
        isEditable : PropTypes.bool,
        onChange : PropTypes.func
    }),
    value : PropTypes.string
};

export default DateTimeCell;