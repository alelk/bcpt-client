/**
 * Array Cell
 *
 * Created by Alex Elkin on 24.10.2017.
 */

import {onCellChange, getErrorIfExists} from './util'
import SimpleValueListDialog from '../dialog/SimpleValueListDialog'
import './Cell.css'

import React from 'react'
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

class ArrayChip extends React.Component {
    constructor(props) {
        super(props);
        this.onOpenDialog = this.onOpenDialog.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.state={isDialogOpened:false}
    }
    onOpenDialog() {
        this.setState({isDialogOpened:true})
    }
    onCloseDialog() {
        this.setState({isDialogOpened:false})
    }
    onValueChange(value) {
        const {column, row} = this.props;
        onCellChange(value, column, row);
    }
    render() {
        const {column, value, error} = this.props;
        return (
            <Chip onClick={this.onOpenDialog} backgroundColor={error && "#aa6056"}>
                {column.iconName && <Avatar icon={
                    <FontIcon className="material-icons">{column.iconName}</FontIcon>
                } backgroundColor={error && "#aa6056"}/>}
                {"Элементов: " + (value && Array.isArray(value) ? value.length : 0)}
                <SimpleValueListDialog
                    open={this.state.isDialogOpened}
                    onRequestClose={this.onCloseDialog}
                    title={column.Header}
                    valueList={value}
                    onChange={this.onValueChange}
                />
            </Chip>
        )
    }
}

const ArrayCell = ({value, column, original, row}) => {
    const error = getErrorIfExists(original, column);
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}${(error && ' isInvalid')||''}`} title={error}>
            <ArrayChip value={value} column={column} row={row} original={original} error={error}/>
        </div>
    )
};

ArrayCell.propTypes = {
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
        Header : PropTypes.object,
        id : PropTypes.string,
        isEditable : PropTypes.bool,
        onChange : PropTypes.func,
        onClick : PropTypes.func,
        iconName: PropTypes.string
    }),
    value : PropTypes.arrayOf(PropTypes.string),
    row: PropTypes.object
};

export default ArrayCell;