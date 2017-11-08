/**
 * Date Time Label
 *
 * Created by Alex Elkin on 18.10.2017.
 */
import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'
import 'moment/locale/ru';

const DateTimeLabel = ({type, className, value, onValueClick, error}) => {
    const pattern = /datetime*/.test(type) ? 'YYYY-MM-DD HH:mm' : /time*/.test(type) ? 'HH:mm' : 'YYYY-MM-DD';
    return (
        <label className={className} onClick={onValueClick} title={error}>
            {value && moment(value).format(pattern)}
        </label>
    );
};
DateTimeLabel.propTypes = {
    className : PropTypes.string,
    type : PropTypes.oneOf(["datetime-local", "date", "time"]),
    value : PropTypes.string,
    onValueClick : PropTypes.func,
    error: PropTypes.string
};

export default DateTimeLabel;