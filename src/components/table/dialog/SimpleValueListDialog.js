/**
 * Array Dialog
 *
 * Created by Alex Elkin on 24.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField';

class SimpleValueListDialog extends React.Component {

    constructor(props) {
        super(props);
        this.onTypeNewValue = this.onTypeNewValue.bind(this);
        this.state = {}
    }

    onTypeNewValue(e) {
        this.setState({newValue : e.target.value});
    }

    render() {
        const {open, title, onRequestClose, valueList, onChange} = this.props;
        return (
            <Dialog open={open}
                    actions={[<RaisedButton primary={true} label="OK" onClick={onRequestClose}/>]}
                    title={title}
                    onRequestClose={onRequestClose}
                    autoScrollBodyContent={true}
                    modal={false}>
                <TextField hintText="Введите новое значение" floatingLabelText="Добавить значение" onChange={this.onTypeNewValue}/>
                <FlatButton label="Добавить" onClick={() => onChange([this.state.newValue, ...valueList || []])}/>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    { Array.isArray(valueList) && valueList.map(v =>
                        <Chip
                            key={v}
                            style={{margin: 10}}
                            onRequestDelete={() => onChange(valueList.filter(i => i !== v))}
                        >
                            {v}
                        </Chip>
                    )}
                </div>
            </Dialog>
        )
    }
}

SimpleValueListDialog.propTypes = {
    open : PropTypes.bool,
    title : PropTypes.string,
    onRequestClose : PropTypes.func,
    onChange : PropTypes.func,
    valueList : PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default SimpleValueListDialog;