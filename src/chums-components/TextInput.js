import React, {PureComponent, Fragment} from 'react';
import classNames from 'classnames';


const TextInput = React.forwardRef((props, ref) => {
    const {onChange, field, className = '', helpText = null, ...rest} = props;
    const _className = {
        'form-control': true,
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
        className
    };
    const changeValue = (ev) => {
        switch (props.type) {
        case 'number':
            return Number(ev.target.value);
        default:
            return ev.target.value;
        }
    };

    return (
        <Fragment>
            <input className={classNames(_className)} onChange={ev => onChange({field, value: changeValue(ev)})} ref={ref} {...rest} />
            {helpText && <small className="form-text text-muted">{helpText}</small>}
        </Fragment>
    );
});

export default TextInput;
