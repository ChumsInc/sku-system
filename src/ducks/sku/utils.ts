import {Product, ProductSKU, ProductSKUSorterProps, ProductSorterProps} from "../../types";

export const defaultSort:ProductSKUSorterProps = {
    field: "id",
    ascending: true,
}

export const productSKUKey = (sku:ProductSKU) => sku.id;
export const productSKUSorter = ({field, ascending}:ProductSKUSorterProps) => 
    (a:ProductSKU, b:ProductSKU) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (productSKUKey(a) > productSKUKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }

export const defaultItemSort:ProductSorterProps = {
    field: 'ItemCode',
    ascending: true,
}

export const productKey = (item:Product) => item.ItemCode;
export const productSorter = ({field, ascending}:ProductSorterProps) =>
    (a:Product, b:Product) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (productKey(a) > productKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }
