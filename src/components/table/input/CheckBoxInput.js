/**
 * Checkbox Input
 *
 * Created by Alex Elkin on 16.10.2017.
 */

import Input from './Input'
import './CheckBoxInput.css'

import React from 'react'
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox'

class CheckBoxInput extends Input {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {}

    onChange(e) {
        this.setState((oldState) => {
            this.props.onChange && this.props.onChange(!oldState.value);
            return {value : !oldState.value};
        });
    }

    render() {
        return (
            <Checkbox checked={this.state.value} onCheck={this.onChange}/>
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