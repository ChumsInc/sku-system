import {fetchJSON} from "chums-components";
import {BaseSKU} from "chums-types";

export const defaultBaseSKU: BaseSKU = {
    id: 0,
    sku: '',
    active: true,
    description: '',
    notes: null,
    sku_group_id: 0,
    upc: ''
}

export async function fetchSKU(id: number): Promise<BaseSKU | null> {
    try {
        if (!id) {
            return {...defaultBaseSKU};
        }
        const url = `/api/operations/sku/base/${encodeURIComponent(id)}`;
        const res = await fetchJSON<{ list: BaseSKU[] }>(url, {cache: "no-cache"});
        return res?.list[0] ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKU()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKU()", err);
        return Promise.reject(new Error('Error in fetchSKU()'));
    }
}

export async function fetchSKUList(groupId: number | null): Promise<BaseSKU[]> {
    try {
        const url = `/api/operations/sku/base/group/${encodeURIComponent(groupId ?? '')}`;
        const res = await fetchJSON<{ list: BaseSKU[] }>(url, {cache: "no-cache"});
        return res?.list ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUList()", err);
        return Promise.reject(new Error('Error in fetchSKUList()'));
    }
}

export async function postSKU(arg: BaseSKU): Promise<BaseSKU|null> {
    try {
        const url = '/api/operations/sku/base';
        const body = JSON.stringify(arg);
        const res = await fetchJSON<{ skuBase: BaseSKU }>(url, {method: 'POST', body});
        return res?.skuBase ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postSKU()", err.message);
            return Promise.reject(err);
        }
        console.debug("postSKU()", err);
        return Promise.reject(new Error('Error in postSKU()'));
    }
}

export async function deleteSKU(arg:BaseSKU, groupId: number|null):Promise<BaseSKU[]> {
    try {
        const url = `/api/operations/sku/base/${encodeURIComponent(arg.id)}/${encodeURIComponent(arg.sku)}`;
        await fetchJSON(url, {method: 'DELETE'});
        return await fetchSKUList(groupId);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteSKU()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteSKU()", err);
        return Promise.reject(new Error('Error in deleteSKU()'));
    }
}
