/**
 * Drop Down Input
 *
 * Created by Alex Elkin on 16.10.2017.
 */
import Input from './Input'

import React from 'react'
import PropTypes from 'prop-types';

class DropDownInput extends Input {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {}

    onChange(e) {
        this.props.onChange && this.props.onChange(e.target.value);
    }

    render() {
        const {error, value, allowedValues} = this.props;
        return (
            <select className={this.className} defaultValue={value} onChange={this.onChange} title={error}>
                { allowedValues &&
                    allowedValues.map(v => <option key={v.value} value={v.value}>{v.displayValue}</option>)
                }
            </select>
        );
    }
}

DropDownInput.propTypes = {
    className : PropTypes.string,
    value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    allowedValues : PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        displayValue: PropTypes.string
    })),
    onChange : PropTypes.func,
    error: PropTypes.string
};

export default DropDownInput;