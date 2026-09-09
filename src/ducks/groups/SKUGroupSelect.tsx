import {type ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectList} from "./index";
import type {SKUGroup} from "chums-types";
import FormSelect from "react-bootstrap/FormSelect";


export interface SKUGroupSelectProps {
    value?: number | null,
    className?: string,
    showInactive?: boolean,
    allowAllGroups?: boolean,
    required?: boolean,
    onChange: (group: SKUGroup | undefined) => void,
}

const SKUGroupSelect = ({
                                                           value,
                                                           className,
                                                           showInactive,
                                                           allowAllGroups,
                                                           onChange
                                                       }:SKUGroupSelectProps) => {
    const skuGroups = useSelector(selectList);
    const [selected] = skuGroups.filter(group => group.id === value);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const id = Number(ev.target.value);
        const [group] = skuGroups.filter(group => group.id === id);
        return onChange(group);
    }
    return (
        <FormSelect value={selected?.id || ''} className={className} onChange={changeHandler} size="sm">
            {!allowAllGroups && (<option>Select SKU Group</option>)}
            {allowAllGroups && (<option value="">All SKU Groups</option>)}
            {skuGroups
                .filter(group => showInactive || group.active)
                .map(group => (
                    <option key={group.id} value={group.id} className={group.active ? '' : 'text-danger'}>
                        {group.code} - {group.description}
                    </option>
                ))}
        </FormSelect>
    )
}

export default SKUGroupSelect;
