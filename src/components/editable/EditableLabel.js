/**
 * Editable Label
 *
 * Created by Alex Elkin on 13.09.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import './EditableLabel.css'
import moment from 'moment'
import 'moment/locale/ru';

const EditableLabel = ({className, inputType, value, onClick, onChange, isEditMode, valueSet, error, isDeleted, isEditable = true, valueSplitRegex}) => {
    const cn = `EditableLabel${(error && ' notValid') || ''}${(isDeleted && ' deleted') || ''}${(className && ' ' + className) || ''}${(onClick != null && !isEditMode) ? ' clickable' : ''}`;
    const errorMessage = error && error.defaultMessage;
    if (!isEditMode || !isEditable)
        if (/datetime.*|date/i.test(inputType))
            return (
                <label className={cn} onClick={onClick}>{value && moment(value)
                    .format(/datetime*/.test(inputType)?'DD.MM.YYYY HH:mm' : 'DD MMM YYYY')}</label>
            );
        else
            return (
                <label className={cn} onClick={onClick}>{Array.isArray(value) ? value.join(', ') : value}</label>
            );
    else if (valueSet)
        return (
            <select className={cn} onChange={(e) => onChange && onChange(e.target.value)} title={errorMessage}>
                {valueSet.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
        );
    else {
        return (
            <input className={cn} type={inputType || "text"} defaultValue={Array.isArray(value) ? value.join(', ') : value}
                   onChange={(e) => onChange && onChange(/checkbox/.test(inputType) ? e.target.checked : valueSplitRegex ? [...e.target.value.split(valueSplitRegex)] : e.target.value)}
                   title={errorMessage}/>
        );
    }
};

EditableLabel.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.string,
    value : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.string)]),
    onClick : PropTypes.func,
    onChange : PropTypes.func,
    isEditMode: PropTypes.bool,
    valueSet: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.shape({defaultMessage : PropTypes.string}),
    valueSplitRegex : PropTypes.object,
    isDeleted: PropTypes.bool,
    isEditable: PropTypes.bool
};

export default EditableLabel;