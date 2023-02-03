import {fetchJSON} from "chums-components";
import {BaseSKU} from "chums-types";
import {ProductSKU} from "../types";

export const defaultBaseSKU:BaseSKU = {
    id: 0,
    sku: '',
    active: true,
    description: '',
    notes: null,
    sku_group_id: 0,
    upc: '',
    Category4: '',
}

export async function fetchSKU(id: number): Promise<BaseSKU | null> {
    try {
        if (!id) {
            return {...defaultBaseSKU};
        }
        const url = `/api/operations/sku/base/${encodeURIComponent(id)}`;
        const {sku} = await fetchJSON<{ sku: BaseSKU }>(url, {cache: "no-cache"});
        return sku ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKU()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKU()", err);
        return Promise.reject(new Error('Error in fetchSKU()'));
    }
}

export async function fetchSKUList(groupId: number|null):Promise<BaseSKU[]> {
    try {
        const url = `/api/operations/sku/base/group/${encodeURIComponent(groupId ?? '')}}`;
        const {list} = await fetchJSON<{list:BaseSKU[]}>(url, {cache: "no-cache"});
        return list ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUList()", err);
        return Promise.reject(new Error('Error in fetchSKUList()'));
    }
}

export async function postSKU(arg:BaseSKU):Promise<BaseSKU> {
    try {
        const url = '/api/operations/sku/base';
        const body = JSON.stringify(arg);
        const {skuBase} = await fetchJSON<{skuBase:BaseSKU}>(url, {method: 'POST', body});
        return skuBase;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postSKU()", err.message);
            return Promise.reject(err);
        }
        console.debug("postSKU()", err);
        return Promise.reject(new Error('Error in postSKU()'));
    }
}
