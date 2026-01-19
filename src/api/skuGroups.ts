import {SKUGroup} from "chums-types";
import {fetchJSON} from "chums-components";
import {defaultSKUGroup} from "../ducks/groups";

export async function fetchSKUGroups():Promise<SKUGroup[]> {
    try {
        const url = '/api/operations/sku/groups';
        const res = await fetchJSON<{list:SKUGroup[]}>(url, {cache: 'no-cache'});
        return res?.list ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUGroups()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUGroups()", err);
        return Promise.reject(new Error('Error in fetchSKUGroups()'));
    }
}

export async function fetchSKUGroup(id:number):Promise<SKUGroup|null> {
    try {
        if (!id) {
            return {...defaultSKUGroup};
        }
        const url = `/api/operations/sku/groups/${encodeURIComponent(id)}`;
        const res = await fetchJSON<{list: SKUGroup[]}>(url, {cache: 'no-cache'});
        return res?.list[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUGroup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUGroup()", err);
        return Promise.reject(new Error('Error in fetchSKUGroup()'));
    }
}

export async function postSKUGroup(arg:SKUGroup):Promise<SKUGroup|null>{
    try {
        const url = '/api/operations/sku/groups';
        const res = await fetchJSON<{group:SKUGroup}>(url, {
            method: 'POST',
            body: JSON.stringify(arg)
        });
        return res?.group ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postSKUGroup()", err.message);
            return Promise.reject(err);
        }
        console.debug("postSKUGroup()", err);
        return Promise.reject(new Error('Error in postSKUGroup()'));
    }
}
