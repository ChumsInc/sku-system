import {ProductColor, ProductColorSorterProps, ProductSKU, ProductSKUSorterProps} from "../../types";

export const defaultColorSort:ProductColorSorterProps = {
    field: "code",
    ascending: true,
}

export const productColorKey = (color:ProductColor) => color.id;
export const productColorSorter = ({field, ascending}:ProductColorSorterProps) =>
    (a:ProductColor, b:ProductColor) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (productColorKey(a) > productColorKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
