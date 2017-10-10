/**
 * Editable
 *
 * Created by Alex Elkin on 10.10.2017.
 */

import './Editable.css'

import React from 'react'
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';

class Editable extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        if (this.props.isEditMode)
            Rx.Observable.create(o => {
                this.observer = o;
            }).sampleTime(1000).subscribe(value => this.props.onChange && this.props.onChange(value))
        this.init();
    }

    componentWillUnmount() {
        this.observer && this.observer.complete();
    }

    init() {
        const {className, onValueClick, isEditMode, error} = this.props;
        this.className = `Editable${(error && ' notValid') || ''}${(className && ' ' + className) || ''}` +
            `${(onValueClick != null && !isEditMode) ? ' clickable' : ''}${(isEditMode && ' editMode') || ''}`;
    }

    componentWillUpdate() {
        this.init();
    }

    onChange(e) {
        this.observer && this.observer.next(e.target.value);
    }

    render() {
        const {inputType, onValueClick, isEditMode, error, value} = this.props;
        if (!isEditMode)
            return (
                <label className={this.className} onClick={onValueClick}>
                    {value}
                </label>
            );
        else {
            return (
                <input className={this.className}
                       type={inputType || "text"}
                       defaultValue={value}
                       onChange={this.onChange}
                       title={error}
                />
            );
        }
    }
}

Editable.propTypes = {
    className : PropTypes.string,
    inputType : PropTypes.oneOf(["number", "text"]),
    value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onValueClick : PropTypes.func,
    onChange : PropTypes.func,
    isEditMode: PropTypes.bool,
    error: PropTypes.string
};

export default Editable;