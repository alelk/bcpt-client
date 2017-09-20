/**
 * Editable Table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Button from '../Button'
import './EditableTable.css'

import React from 'react'
import PropTypes from 'prop-types'

const EditableTable = ({children, isEditMode, onAdd, onEdit, onDone, onCancel, onRemove}) => {
    return (
        <div className="EditableTable">
            <div className="controls">
                {isEditMode && <Button iconName='clear' className="cancel" onClick={onCancel}/>}
                {isEditMode && <Button iconName='done' className="done" onClick={onDone}/>}
                {isEditMode && <Button iconName='delete' className="remove" onClick={onRemove}/>}
                {!isEditMode && <Button iconName='mode_edit' className="edit" onClick={onEdit}/>}
                <Button iconName='add' className="add" onClick={onAdd}/>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    )
};
EditableTable.propTypes = {
    headers : PropTypes.arrayOf(PropTypes.string),
    isEditMode : PropTypes.bool,
    onAdd : PropTypes.func,
    onEdit : PropTypes.func,
    onDone : PropTypes.func,
    onRemove : PropTypes.func,
    onCancel : PropTypes.func
};

export default EditableTable;