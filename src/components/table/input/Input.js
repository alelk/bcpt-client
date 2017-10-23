/**
 * Input
 *
 * Created by Alex Elkin on 16.10.2017.
 */

import './Input.css'

import React from 'react'
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';

class Input extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: this.props.value,
            className : Input.className(props)
        }
    }

    componentWillMount() {
        const {onChange, onChangeDelayMillis} = this.props;
        if (onChange)
            Rx.Observable.create(o => {
                this.observer = o;
            }).sampleTime(onChangeDelayMillis || 1000).subscribe(value => onChange(value));
    }

    componentWillUnmount() {
        this.observer && this.observer.complete();
    }

    static className(props) {
        const {className, error} = props;
        return `Input${(error && ' notValid') || ''}${(className && ' ' + className) || ''}`;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value)
            this.setState({
                value: nextProps.value
            });
        if (nextProps.error !== this.props.error)
            this.setState({
                className: Input.className(nextProps)
            });
    }

    onChange(e) {
        this.setState({value:e.target.value});
        this.observer && this.observer.next(e.target.value);
    }

    render() {
        const {inputType, error} = this.props;
        return (
            <input className={this.state.className}
                   type={inputType || "text"}
                   value={this.state.value}
                   onChange={this.onChange}
                   title={error}
            />
        );
    }
}

Input.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.oneOf(["number", "text"]),
    value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange : PropTypes.func,
    onChangeDelayMillis : PropTypes.number,
    error: PropTypes.string
};

export default Input;