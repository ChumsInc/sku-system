import React from "react";
import {FormCheck} from "chums-ducks";

export interface ShowInactiveCheckboxProps {
    checked: boolean,
    countAll?: number,
    countActive?: number,
    onChange: () => void,
}
const ShowInactiveCheckbox:React.FC<ShowInactiveCheckboxProps> = ({
                                                                      checked,
                                                                      countAll,
                                                                      countActive,
                                                                      onChange
}) => {
    const count = (checked ? countAll : countActive) || 0;
    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" checked={checked}
                   onChange={onChange}/>
            <label className="form-check-label" onClick={onChange}>
                Show Inactive {!!countAll && (<small>({count}/{countAll})</small>)}?
            </label>
        </div>
    )
}

export default ShowInactiveCheckbox;
