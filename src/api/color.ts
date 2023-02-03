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
        const {list} = await fetchJSON<{list: ProductColor[]}>(url, {cache: "no-cache"});
        return list ?? [];
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
        const {list = []} = await fetchJSON<{list: ProductColor[]}>(url, {cache: "no-cache"});
        return list[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchProductColor()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchProductColor()", err);
        return Promise.reject(new Error('Error in fetchProductColor()'));
    }
}

export async function postProductColor(arg:ProductColor):Promise<ProductColor> {
    try {
        const url = `/api/operations/sku/colors/${encodeURIComponent(arg.id)}`;
        const {color} = await fetchJSON<{color:ProductColor}>(url, {method: 'POST', body: JSON.stringify(arg)});
        return color;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postColor()", err.message);
            return Promise.reject(err);
        }
        console.debug("postColor()", err);
        return Promise.reject(new Error('Error in postColor()'));
    }
}
