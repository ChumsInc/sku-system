import React, {InputHTMLAttributes, useId} from "react";

export interface ShowInactiveCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    countAll?: number,
    countActive?: number,
}

const ShowInactiveCheckbox = ({
                                  id,
                                  checked,
                                  countAll,
                                  countActive,
                                  onChange,
                                  ...rest
                              }: ShowInactiveCheckboxProps) => {
    const elementId = useId();
    const count = (checked ? countAll : countActive) || 0;
    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" id={id ?? elementId} checked={checked}
                   onChange={onChange} {...rest} />
            <label className="form-check-label" htmlFor={id ?? elementId}>
                Show Inactive {!!countAll && (<small>({count}/{countAll})</small>)}?
            </label>
        </div>
    )
}

export default ShowInactiveCheckbox;
