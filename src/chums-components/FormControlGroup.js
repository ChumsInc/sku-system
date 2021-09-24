/**
 * Created by steve on 9/14/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class FormControlGroup extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        value: PropTypes.any,
        label: PropTypes.string,
        name: PropTypes.string,
        colWidth: PropTypes.number,
        hidden: PropTypes.bool,
        small: PropTypes.bool,
        large: PropTypes.bool,
        address: PropTypes.object,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        hideLabel: PropTypes.bool,
        onChange: PropTypes.func,
        feedback: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }


    defaultColWidth = 8;
    onChange(ev) {
        this.props.onChange(ev.target.value);
    }

    onChangeValue(val) {
        this.props.onChange(val);
    }

    render() {
        let {className, type, onChange, style, colWidth, value, small, large, feedback, ...props} = this.props;
        let formControl;

        const inputClasses = {};
        if (small) {
            inputClasses['form-control-sm'] = true;
        } else if (large) {
            inputClasses['form-control-lg'] = true;
        }

        switch (type) {
        case 'span':
            formControl = <span className="form-control">{value}</span>;
            break;

        case 'textarea':
            formControl = (
                <textarea className={classNames("form-control", className, inputClasses)} onChange={this.onChange}
                          value={value} {...props}/>
            );
            break;

        default:
            if (this.props.children) {
                formControl = this.props.children;
            } else {
                formControl = (
                    <input type={type} value={value} {...props}
                           className={classNames("form-control", className, inputClasses)}
                           onChange={this.onChange}
                    />
                );
            }
            break;
        }

        let colLeft = colWidth ? `col-${12 - (colWidth || this.defaultColWidth)}` : '',
            colRight = colWidth ? `col-${(colWidth || this.defaultColWidth)}` : '',
            hidden = this.props.hidden ? 'hidden' : '',
            hideLabel = this.props.hideLabel ? 'sr-only' : '';

        let divClasses = {
            hidden: this.props.hidden,
            'form-group': !small,
            'form-row': colWidth && small,
            'row': colWidth && !small,
            'has-feedback': feedback !== '',
            'has-success': feedback === 'success',
            'has-warning': feedback === 'warning',
            'has-error': feedback === 'error',
        };
        let iconClasses = {
            glyphicon: true,
            'form-control-feedback': true,
            'glyphicon-ok ': feedback === 'success',
            'glyphicon-warning-sign': feedback === 'warning',
            'glyphicon-remove': feedback === 'error',
        };

        let feedbackComponent = feedback !== ''
            ? <span>
                <span className={classNames(iconClasses)} aria-hidden="true" />
                <span id="inputWarning2Status" className="sr-only">(warning)</span>
            </span>
            : null;

        return (
            <div className={classNames(divClasses, className)} style={style}>
                <label className={classNames('control-label', colLeft, hideLabel)}>{this.props.label}</label>
                <div className={classNames(colRight)}>
                    {formControl}
                    {feedbackComponent}
                </div>
            </div>
        )
    }
}
