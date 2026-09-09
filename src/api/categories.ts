import {fetchJSON} from "@chumsinc/ui-utils";
import type {ProductCategory} from "chums-types";

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
            ? `/api/operations/sku/categories/${encodeURIComponent(id)}.json`
            : `/api/operations/sku/categories/by-id/${encodeURIComponent(id)}.json`
        const res = await fetchJSON<{ category: ProductCategory|null }>(url, {cache: 'no-cache'})
        return res?.category ?? null;
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
        const url = '/api/operations/sku/categories.json';
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
        const url = '/api/operations/sku/categories/:code.json'
            .replace(':code', encodeURIComponent(arg.code))
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
