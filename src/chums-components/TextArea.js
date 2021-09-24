import React, {PureComponent, Fragment} from 'react';
import classNames from 'classnames';


const TextArea = React.forwardRef((props, ref) => {
    const {onChange, field, className = '', helpText = null, value, ...rest} = props;
    const _className = {
        'form-control': true,
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
        className
    };

    return (
        <Fragment>
            <textarea className={classNames(_className)} onChange={ev => onChange({field, value: ev.target.value})}
                      ref={ref} {...rest} value={value} />
            {helpText && <small className="form-text text-muted">{helpText}</small>}
        </Fragment>
    );
});

export default TextArea;
