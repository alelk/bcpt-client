/**
 * Checkbox Input
 *
 * Created by Alex Elkin on 16.10.2017.
 */

import Input from './Input'
import './CheckBoxInput.css'

import React from 'react'
import PropTypes from 'prop-types';

class CheckBoxInput extends Input {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {}

    onChange(e) {
        this.setState({value: e.target.value});
        this.props.onChange && this.props.onChange(e.target.checked);
    }

    render() {
        return (
            <input type="checkbox" className={this.className} value={this.state.value} checked={this.state.value} onChange={this.onChange} title={this.props.error}/>
        );
    }
}

CheckBoxInput.propTypes = {
    className : PropTypes.string,
    value : PropTypes.bool,
    onChange : PropTypes.func,
    error: PropTypes.string
};

export default CheckBoxInput;