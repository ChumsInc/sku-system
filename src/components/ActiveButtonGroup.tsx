import React from "react";
import classNames from "classnames";


export interface ActiveButtonGroupProps {
    active: boolean,
    disabled?: boolean,
    onChange: (active:boolean) => void,
}
const ActiveButtonGroup:React.FC<ActiveButtonGroupProps> = ({active, disabled, onChange}) => {
    const activeButtonClassName = {
        'btn-success': active,
        'btn-outline-success': !active
    };
    const inactiveButtonClassName = {
        'btn-outline-danger': active,
        'btn-danger': !active,
    };

    return (
        <div className="btn-group btn-group-sm">
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

export default ActiveButtonGroup;
