import {SortProps} from "chums-components";
import {ProductColorUPC, ProductColorUPCResponse} from 'chums-types';


export const colorUPCKey = (color: ProductColorUPC) => color.upc;

export const colorUPCSorter = ({field, ascending}: SortProps<ProductColorUPCResponse>) =>
    (a: ProductColorUPCResponse, b: ProductColorUPCResponse) => {
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


