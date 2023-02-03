import {SortProps} from "chums-components";
import {ProductCategory} from "chums-types";

export const categoryKey = (cat?: ProductCategory | null) => [cat?.code, cat?.productLine].join(':');

export const categorySorter = ({field, ascending}: SortProps<ProductCategory>) =>
    (a: ProductCategory, b: ProductCategory) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (categoryKey(a) > categoryKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
