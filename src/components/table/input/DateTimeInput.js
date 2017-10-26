/**
 * Date & Time Input
 *
 * Created by Alex Elkin on 18.10.2017.
 */
import Input from './Input'

import React from 'react'
import PropTypes from 'prop-types';
import moment from 'moment'
import 'moment/locale/ru';

class DateTimeInput extends Input{


    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            console.log("next value: " + nextProps.value);
            this.setState({
                value: nextProps.value
            })
        }
    }

    onChange(e) {
        this.setState({value:moment(e.target.value).format()});
        this.observer && this.observer.next(moment(e.target.value).format());
    }

    render() {
        const {inputType, error} = this.props;
        const pattern = /datetime*/.test(inputType) ? 'YYYY-MM-DD HH:mm' : /time*/.test(inputType) ? 'HH:mm' : 'YYYY-MM-DD';
        return (
            <input className={this.className}
                   type={inputType || "date"}
                   defaultValue={moment(this.state.value).format(pattern)}
                   onChange={this.onChange}
                   title={error}
                   style={{width:'100%'}}
            />
        );
    }
}
DateTimeInput.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.oneOf(["datetime-local", "date", "time"]),
    value : PropTypes.string,
    onChange : PropTypes.func,
    onChangeDelayMillis : PropTypes.number,
    error: PropTypes.string
};

export default DateTimeInput;