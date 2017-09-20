/**
 * Editable Label
 *
 * Created by Alex Elkin on 13.09.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import './EditableLabel.css'

const EditableLabel = ({className, inputType, value, onClick, onChange, isEditMode, valueSet, error}) => {
    const cn = `EditableLabel ${(error && 'notValid') || ''} ${className || ''}`.trim();
    const errorMessage = error && error.defaultMessage;
    if (!isEditMode)
        return (
            <label className={cn} onClick={onClick}>{value}</label>
        );
    else if (valueSet)
        return (
            <select className={cn} onChange={(e) => onChange && onChange(e.target.value)} title={errorMessage}>
                {valueSet.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
        );
    else
        return (
            <input className={cn} type={inputType || "text"} defaultValue={value} onClick={onClick}
                   onChange={(e) => onChange && onChange(/checkbox/.test(inputType)? e.target.checked : e.target.value)}
                   title={errorMessage} />
        );
};

EditableLabel.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.string,
    value : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
    onClick : PropTypes.func,
    onChange : PropTypes.func,
    isEditMode: PropTypes.bool,
    valueSet: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.shape({defaultMessage : PropTypes.string})
};

export default EditableLabel;