import React, {PureComponent, forwardRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Select extends PureComponent {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any,
            text: PropTypes.string,
        })),
        forwardRef: PropTypes.any,
    };

    static defaultProps = {
        options: [],
        className: 'form-control-sm'
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        const {field, onChange} = this.props;
        onChange({field, value: ev.target.value});
    }

    render() {
        const {field, value, onChange, className, options = [], children, forwardedRef, ...rest} = this.props;
        return (
            <select className={classNames("form-control", className)}
                    ref={forwardedRef}
                    value={value}
                    onChange={this.onChange} {...rest}>
                {children}
                {!!options.length && options.map((opt, key) => <option key={key} value={opt.value}>{opt.text || opt.value}</option>)}
            </select>
        );
    }

}

export default forwardRef((props, ref) => <Select {...props}
                                                  forwardedRef={ref}/>)

