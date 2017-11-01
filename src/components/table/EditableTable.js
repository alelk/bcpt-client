/**
 * Editable Table
 *
 * Created by Alex Elkin on 13.09.2017.
 */
import Button from '../Button'
import './EditableTable.css'

import React from 'react'
import PropTypes from 'prop-types'

const EditableTable = ({
    children, onUncheckItems, onCheckAllItems, isEditMode, checkedItems, onAdd, onEdit, onDone, onCancel, onRemove,
    onRefresh, tableName, controls, onAppDrawerRequest
}) => {
    const checkedItemsCount = Array.isArray(checkedItems) ? checkedItems.length : 0;
    return (
        <div className="EditableTable">
            <div className="controls">
                {onAppDrawerRequest && <Button className="btnAppDrawer" iconName="menu" onClick={onAppDrawerRequest} title="Открыть системное меню"/>}
                <label className="tableName">{tableName}</label>
                {checkedItemsCount > 0 &&
                <label className="itemsSelected">
                    <span>{`${checkedItemsCount} строк выделено`}</span>
                    <Button iconName='done_all' className='checkAll' onClick={onCheckAllItems} title="Выделить все на странице"/>
                    <Button iconName='clear' className='clearSelection' onClick={onUncheckItems} title="Снять выделение"/>
                </label>
                }
                {isEditMode &&
                <Button iconName='clear' className="cancel" onClick={onCancel} title="Отменить изменения"/>
                }
                {isEditMode && <Button iconName='done' className="done" onClick={onDone} title="Применить изменения"/>
                }
                {!isEditMode &&
                <Button iconName='sync' className="refresh" onClick={onRefresh} title="Обновить данные"/>
                }
                {checkedItemsCount > 0 &&
                <Button iconName='delete' className="change" onClick={onRemove} title="Удалить выделенные строки"/>
                }
                {checkedItemsCount > 0 &&
                <Button iconName='mode_edit' className="change" onClick={onEdit} title="Редактировать выделенные строки"/>
                }
                <Button iconName='add' className="change" onClick={onAdd} title="Добавить строку"/>
                {
                    controls && controls.map((c) => {
                        const {control, onCheckedItems, onEditMode} = c;
                        if(!onCheckedItems && !onEditMode) return control;
                        if (onCheckedItems && checkedItemsCount > 0) return control;
                        if (onEditMode && isEditMode) return control;
                        return undefined;
                    })
                }
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    )
};
EditableTable.propTypes = {
    onAppDrawerRequest : PropTypes.func,
    checkedItems : PropTypes.arrayOf(PropTypes.string),
    tableName : PropTypes.string,
    isEditMode : PropTypes.bool,
    onAdd : PropTypes.func,
    onEdit : PropTypes.func,
    onDone : PropTypes.func,
    onRemove : PropTypes.func,
    onCancel : PropTypes.func,
    onRefresh : PropTypes.func,
    onUncheckItems : PropTypes.func,
    onCheckAllItems : PropTypes.func,
    controls : PropTypes.arrayOf(PropTypes.shape({
        onCheckedItems : PropTypes.bool,
        onEditMode : PropTypes.bool,
        control : PropTypes.object
    }))
};

export default EditableTable;