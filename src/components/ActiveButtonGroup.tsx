import classNames from "classnames";


export interface ActiveButtonGroupProps {
    active: boolean,
    disabled?: boolean,
    onChange: (active: boolean) => void,
}

export default function ActiveButtonGroup({active, disabled, onChange}: ActiveButtonGroupProps) {
    const activeButtonClassName = {
        'btn-success': active,
        'btn-outline-success': !active
    };
    const inactiveButtonClassName = {
        'btn-outline-danger': active,
        'btn-danger': !active,
    };

    return (
        <div className="btn-group btn-group-sm my-1">
            <button type="button"
                    className={classNames('btn btn-sm', activeButtonClassName)}
                    disabled={disabled}
                    onClick={() => onChange(true)}>Yes
            </button>
            <button type="button"
                    className={classNames('btn btn-sm', inactiveButtonClassName)}
                    disabled={disabled}
                    onClick={() => onChange(false)}>No
            </button>
        </div>
    )
}
