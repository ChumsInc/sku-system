import React, {ChangeEvent} from "react";
import {Select} from "chums-components";

export interface CompanySelectProps {
    value: '' | 'chums' | 'bc',
    disabled?: boolean,
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void,
}

const CompanySelect: React.FC<CompanySelectProps> = ({value, disabled, onChange}) => {
    return (
        <Select value={value} bsSize="sm" onChange={onChange}>
            <option value="">Select Company</option>
            <option value="chums">Chums</option>
            <option value="bc">Beyond Coastal</option>
        </Select>
    )
}

export default CompanySelect;
