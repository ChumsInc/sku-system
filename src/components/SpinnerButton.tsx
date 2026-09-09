import {Button, type ButtonProps, Spinner, type SpinnerProps} from "react-bootstrap";
import classNames from "classnames";

export interface SpinnerButtonProps extends ButtonProps {
    spinnerProps?: SpinnerProps;
    spinnerPosition?: 'start' | 'end'
    spinning?: boolean
}

export default function SpinnerButton({children, spinnerProps, spinning, spinnerPosition, ...buttonProps}: SpinnerButtonProps) {
    const _spinnerProps: SpinnerProps = {...spinnerProps};
    if (!_spinnerProps.size && buttonProps.size === 'sm') {
        _spinnerProps.size = 'sm';
    }
    return (
        <Button {...buttonProps}>
            {spinning && (spinnerPosition ?? 'start') === 'start' && (
                <Spinner animation={_spinnerProps?.animation ?? "border"} {..._spinnerProps} className={classNames("me-2", spinnerProps?.className)} />
            )}
            {children}
            {spinning && (spinnerPosition ?? 'start') === 'end' && (
                <Spinner animation={_spinnerProps?.animation ?? "border"} {..._spinnerProps} className={classNames("ms-2", spinnerProps?.className)} />
            )}
        </Button>
    )
}
