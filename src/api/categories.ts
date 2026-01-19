import {fetchJSON} from "chums-components";
import {ProductCategory} from "chums-types";

export const defaultCategory: ProductCategory = {
    id: null,
    code: '',
    description: '',
    notes: '',
    tags: {},
    active: true,
    productLine: '',
    Category2: ''
}


export async function fetchCategory(id: number|null|string): Promise<ProductCategory | null> {
    try {
        if (!id) {
            return {...defaultCategory};
        }
        const url = typeof id === 'string'
            ? `/api/operations/sku/categories/code/${encodeURIComponent(id)}`
            : `/api/operations/sku/categories/${encodeURIComponent(id)}`
        const res = await fetchJSON<{ list?: ProductCategory[] }>(url, {cache: 'no-cache'})
        return res?.list?.[0] ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategory()", err);
        return Promise.reject(new Error('Error in fetchCategory()'));
    }
}

export async function fetchCategoryList(): Promise<ProductCategory[]> {
    try {
        const url = '/api/operations/sku/categories';
        const res = await fetchJSON<{ list?: ProductCategory[] }>(url, {cache: 'no-cache'})
        return res?.list ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCategoryList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategoryList()", err);
        return Promise.reject(new Error('Error in fetchCategoryList()'));
    }
}

export async function postCategory(arg: ProductCategory): Promise<ProductCategory|null> {
    try {
        const url = '/api/operations/sku/categories';
        const body = JSON.stringify(arg);
        const res = await fetchJSON<{ category: ProductCategory }>(url, {method: 'POST', body});
        return res?.category ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCategory()", err);
        return Promise.reject(new Error('Error in postCategory()'));
    }
}
