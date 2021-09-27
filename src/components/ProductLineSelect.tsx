import React, {ChangeEvent} from "react";
import {Select} from "chums-ducks";
import {ProductLine} from "../types";
import {useSelector} from "react-redux";
import {selectProductLineList} from "../ducks/settings";

export interface ProductLineSelectProps {
    value: string,
    disabled?: boolean,
    required?: boolean,
    onChange?: (ev:ChangeEvent<HTMLSelectElement>) => void,
    onSelect?: (pl?:ProductLine) => void,
}

const ProductLineSelect:React.FC<ProductLineSelectProps> = ({value, disabled, required, onChange, onSelect}) => {
    const list = useSelector(selectProductLineList);

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const code = ev.target.value;
        const [pl] = list.filter(pl => pl.ProductLine === code);
        if (!!onChange) {
            return onChange(ev)
        }
        if (!!onSelect) {
            onSelect(pl);
        }
    }
    return (
        <Select bsSize="sm" onChange={changeHandler} value={value} disabled={disabled} required={required}>
            <option value="">Select Product Line</option>
            {list.map(pl => (
                <option key={pl.ProductLine} value={pl.ProductLine}>{pl.ProductLine} - {pl.ProductLineDesc}</option>
            ))}
        </Select>
    )
}

export default ProductLineSelect;
