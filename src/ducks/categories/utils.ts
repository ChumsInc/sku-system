import {Category, CategorySorterProps} from "../../types";

export const defaultCategorySort: CategorySorterProps = {
    field: "code",
    ascending: true,
}

export const categoryKey = (cat: Category) => [cat.code, cat.productLine].join(':');
export const categorySorter = ({field, ascending}: CategorySorterProps) =>
    (a: Category, b: Category) => {
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
