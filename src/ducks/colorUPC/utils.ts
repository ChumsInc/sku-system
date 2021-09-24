import {ColorUPC, ColorUPCSorterProps} from "../../types";

export const defaultColorUPCSort: ColorUPCSorterProps = {
    field: "upc",
    ascending: true,
}

export const colorUPCKey = (color: ColorUPC) => color.upc;

export const colorUPCSorter = ({field, ascending}: ColorUPCSorterProps) =>
    (a: ColorUPC, b: ColorUPC) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (colorUPCKey(a) > colorUPCKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
