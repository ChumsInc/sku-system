import {fetchJSON} from "chums-components";
import {ProductColor} from "chums-types";


export const defaultProductColor: ProductColor = {
    id: 0,
    code: '',
    description: '',
    notes: null,
    tags: {},
    active: true,
}

export async function fetchProductColorsList():Promise<ProductColor[]> {
    try {
        const url = '/api/operations/sku/colors';
        const res = await fetchJSON<{list: ProductColor[]}>(url, {cache: "no-cache"});
        return res?.list ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchColorsList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchColorsList()", err);
        return Promise.reject(new Error('Error in fetchColorsList()'));
    }
}

export async function fetchProductColor(id:number):Promise<ProductColor|null> {
    try {
        if (!id) {
            return defaultProductColor;
        }
        const url = `/api/operations/sku/colors/${encodeURIComponent(id)}`;
        const res = await fetchJSON<{list: ProductColor[]}>(url, {cache: "no-cache"});
        return res?.list[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchProductColor()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchProductColor()", err);
        return Promise.reject(new Error('Error in fetchProductColor()'));
    }
}

export async function postProductColor(arg:ProductColor):Promise<ProductColor|null> {
    try {
        const url = `/api/operations/sku/colors/${encodeURIComponent(arg.id)}`;
        const res = await fetchJSON<{color:ProductColor}>(url, {method: 'POST', body: JSON.stringify(arg)});
        return res?.color ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postColor()", err.message);
            return Promise.reject(err);
        }
        console.debug("postColor()", err);
        return Promise.reject(new Error('Error in postColor()'));
    }
}
