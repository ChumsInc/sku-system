import {ProductMix, ProductMixSorterProps} from "../../types";

export const defaultMixSort: ProductMixSorterProps = {
    field: "code",
    ascending: true,
}

export const productMixKey = (mix: ProductMix) => mix.id;
export const productMixSorter = ({field, ascending}: ProductMixSorterProps) =>
    (a: ProductMix, b: ProductMix) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (productMixKey(a) > productMixKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
