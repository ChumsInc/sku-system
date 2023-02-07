import React, {ChangeEvent} from "react";
import {Select} from "chums-components";
import {useSelector} from "react-redux";
import {selectList} from "./index";
import {SKUGroup} from "chums-types";


export interface SKUGroupSelectProps {
    value?: number | null,
    className?: string,
    showInactive?: boolean,
    allowAllGroups?: boolean,
    required?: boolean,
    onChange: (group: SKUGroup | undefined) => void,
}

const SKUGroupSelect: React.FC<SKUGroupSelectProps> = ({
                                                           value,
                                                           className,
                                                           showInactive,
                                                           allowAllGroups,
                                                           onChange
                                                       }) => {
    const skuGroups = useSelector(selectList);
    const [selected] = skuGroups.filter(group => group.id === value);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value);
        const [group] = skuGroups.filter(group => group.id === id);
        return onChange(group);
    }
    return (
        <Select value={selected?.id || ''} className={className} onChange={changeHandler} bsSize="sm">
            {!allowAllGroups && (<option>Select SKU Group</option>)}
            {allowAllGroups && (<option value="">All SKU Groups</option>)}
            {skuGroups
                .filter(group => showInactive || group.active)
                .map(group => (
                    <option key={group.id} value={group.id} className={group.active ? '' : 'text-danger'}>
                        {group.code} - {group.description}
                    </option>
                ))}
        </Select>
    )
}

export default SKUGroupSelect;
