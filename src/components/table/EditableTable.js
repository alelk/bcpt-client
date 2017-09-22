/**
 * Editable Table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Button from '../Button'
import './EditableTable.css'

import React from 'react'
import PropTypes from 'prop-types'

const EditableTable = ({children, isEditMode, onAdd, onEdit, onDone, onCancel, onRemove, onRefresh, tableName}) => {
    return (
        <div className="EditableTable">
            <div className="controls">
                <label className="tableName">{tableName}</label>
                {isEditMode && <Button iconName='clear' className="cancel" onClick={onCancel} title="Отменить изменения"/>}
                {isEditMode && <Button iconName='done' className="done" onClick={onDone} title="Применить изменения"/>}
                {isEditMode && <Button iconName='delete' className="remove" onClick={onRemove} title="Удалить выделенные строки"/>}
                {!isEditMode && <Button iconName='sync' className="refresh" onClick={onRefresh} title="Обновить данные"/>}
                {!isEditMode && <Button iconName='mode_edit' className="edit" onClick={onEdit} title="Редактировать таблицу"/>}
                <Button iconName='add' className="add" onClick={onAdd} title="Добавить строку"/>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    )
};
EditableTable.propTypes = {
    headers : PropTypes.arrayOf(PropTypes.string),
    tableName : PropTypes.string,
    isEditMode : PropTypes.bool,
    onAdd : PropTypes.func,
    onEdit : PropTypes.func,
    onDone : PropTypes.func,
    onRemove : PropTypes.func,
    onCancel : PropTypes.func,
    onRefresh : PropTypes.func,
};

export default EditableTable;