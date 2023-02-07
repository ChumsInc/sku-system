import {Product} from "../../types";
import {SortProps} from "chums-components";
import {BaseSKU} from "chums-types";

export const defaultSort: SortProps<BaseSKU> = {
    field: "sku",
    ascending: true,
}

export const productSKUKey = (sku: BaseSKU) => sku.id;

export const productSKUSorter = ({field, ascending}: SortProps<BaseSKU>) =>
    (a: BaseSKU, b: BaseSKU) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        return (
            aVal === bVal
                ? (productSKUKey(a) > productSKUKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }

export const defaultItemSort: SortProps<Product> = {
    field: 'ItemCode',
    ascending: true,
}

export const productKey = (item: Product) => item.ItemCode;

export const productSorter = ({field, ascending}: SortProps<Product>) =>
    (a: Product, b: Product) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        return (
            aVal === bVal
                ? (productKey(a) > productKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
