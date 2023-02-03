import {SortProps} from "chums-components";
import {ProductColor} from "chums-types";

export const defaultColorSort: SortProps<ProductColor> = {
    field: "code",
    ascending: true,
}

export const productColorKey = (color: ProductColor) => color.id;
export const productColorSorter = ({field, ascending}: SortProps<ProductColor>) =>
    (a: ProductColor, b: ProductColor) => {
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
