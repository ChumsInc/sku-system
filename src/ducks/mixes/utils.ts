import {SortProps} from "chums-components";
import {ProductMixInfo} from "chums-types";

export const defaultMixSort: SortProps<ProductMixInfo> = {
    field: "code",
    ascending: true,
}

export const productMixKey = (mix: ProductMixInfo) => mix.id;

export const productMixSorter = ({field, ascending}: SortProps<ProductMixInfo>) =>
    (a: ProductMixInfo, b: ProductMixInfo) => {
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
