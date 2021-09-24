import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";



export default class FormGroupTextInput extends PureComponent {
    static propTypes = {
        label: PropTypes.string,
        formGroupClassName: PropTypes.string,
        labelClassName: PropTypes.string,
        colWidth: PropTypes.number,
        type: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        field: PropTypes.string,
        className: PropTypes.string,
        id: PropTypes.string,
        helpText: PropTypes.string,
    };

    static defaultProps = {
        label: FormGroup.defaultProps.label,
        colWidth: FormGroup.defaultProps.colWidth,
        formGroupClassName: FormGroup.defaultProps.className,
        labelClassName: FormGroup.defaultProps.labelClassName,
        type: '',
        value: '',
        field: null,
        className: '',
        id: null,
        helpText: null,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.props.onChange(value);
    }

    render() {
        const {onChange, colWidth, value, className, id, labelClassName, formGroupClassName, label, field, placeholder,
            children, inline, readOnly, helpText, ...rest} = this.props;
        return (
            <FormGroup colWidth={colWidth} inline={inline}
                       className={formGroupClassName} htmlFor={id}
                       labelClassName={labelClassName} label={label} helpText={helpText} >
                <TextInput id={id} className={className}
                           value={value} field={field}
                           onChange={this.onChange}
                           placeholder={placeholder || label}
                           readOnly={readOnly}
                           {...rest}/>
                {children}
            </FormGroup>
        );
    }
}
