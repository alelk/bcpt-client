/**
 * Date/Time Editable label
 *
 * Created by Alex Elkin on 09.10.2017.
 */

import Editable from './Editable'

import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'
import 'moment/locale/ru';

class DateTimeEditable extends Editable {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.observer && this.observer.next(moment(e.target.value).format());
    }

    render() {
        const {inputType, onValueClick, isEditMode, error, value} = this.props;
        this.pattern = /datetime*/.test(this.props.inputType) ? 'YYYY-MM-DD HH:mm' : /time*/.test(this.props.inputType) ? 'HH:mm' : 'YYYY-MM-DD';
        if (!isEditMode)
            return (
                <label className={this.className + ' DateTimeEditable'} onClick={onValueClick}>
                    {value && moment(value).format(this.pattern)}
                </label>
            );
        else {
            return (
                <input className={this.className + ' DateTimeEditable'}
                       type={inputType || "date"}
                       defaultValue={moment(value).format(this.pattern)}
                       onChange={this.onChange}
                       title={error}
                />
            );
        }
    }
}

DateTimeEditable.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.oneOf(["datetime", "datetime-local", "date", "time"]),
    value : PropTypes.string,
    onValueClick : PropTypes.func,
    onChange : PropTypes.func,
    isEditMode: PropTypes.bool,
    error: PropTypes.string
};

export default DateTimeEditable;