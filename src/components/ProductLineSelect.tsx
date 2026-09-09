import {type ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectProductLineList} from "../ducks/settings";
import type {ProductLine} from "chums-types";
import FormSelect from "react-bootstrap/FormSelect";

export interface ProductLineSelectProps {
    value: string,
    disabled?: boolean,
    required?: boolean,
    onChange?: (ev: ChangeEvent<HTMLSelectElement>) => void,
    onSelect?: (pl?: ProductLine) => void,
}

const ProductLineSelect = ({value, disabled, required, onChange, onSelect}: ProductLineSelectProps) => {
    const list = useSelector(selectProductLineList);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
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
        <FormSelect size="sm" onChange={changeHandler} value={value} disabled={disabled} required={required}>
            <option value="">Select Product Line</option>
            {list.map(pl => (
                <option key={pl.ProductLine} value={pl.ProductLine}>{pl.ProductLine} - {pl.ProductLineDesc}</option>
            ))}
        </FormSelect>
    )
}

export default ProductLineSelect;
