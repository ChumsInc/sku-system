import React, {InputHTMLAttributes, useId} from "react";

export interface ShowInactiveCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    countInactive?: number;
}

const ShowInactiveCheckbox = ({
                                  id,
                                  checked,
                                  countInactive,
                                  onChange,
                                  ...rest
                              }: ShowInactiveCheckboxProps) => {
    const elementId = useId();
    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" id={id ?? elementId} checked={checked}
                   onChange={onChange} {...rest} />
            <label className="form-check-label" htmlFor={id ?? elementId}>
                Include Inactive <small>({countInactive})</small>?
            </label>
        </div>
    )
}

export default ShowInactiveCheckbox;
