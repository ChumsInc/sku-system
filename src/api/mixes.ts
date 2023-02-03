import {ProductMixInfo} from "chums-types";
import {fetchJSON} from "chums-components";

export async function fetchMixList():Promise<ProductMixInfo[]> {
    try {
        const url = '/api/operations/sku/mixes';
        const {list} = await fetchJSON<{list:ProductMixInfo[]}>(url, {cache: "no-cache"});
        return list ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchMixList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchMixList()", err);
        return Promise.reject(new Error('Error in fetchMixList()'));
    }
}

export async function fetchMix(arg:number):Promise<ProductMixInfo|null> {
    try {
        const url = `/api/operations/sku/mixes/${encodeURIComponent(arg)}`;
        const {list = []} = await fetchJSON<{list:ProductMixInfo[]}>(url, {cache: "no-cache"});
        return list[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchMix()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchMix()", err);
        return Promise.reject(new Error('Error in fetchMix()'));
    }
}

async function putMix(arg:ProductMixInfo):Promise<ProductMixInfo> {
    try {
        const url = `/api/operations/sku/mixes/${encodeURIComponent(arg.id)}`;
        const {mix} = await fetchJSON<{mix:ProductMixInfo}>(url, {
            method: 'PUT',
            body: JSON.stringify(arg),
            });
        return mix;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("putMix()", err.message);
            return Promise.reject(err);
        }
        console.debug("putMix()", err);
        return Promise.reject(new Error('Error in putMix()'));
    }
}

export async function postMix(arg:ProductMixInfo):Promise<ProductMixInfo> {
    try {
        if (arg.id) {
            return putMix(arg);
        }
        const url = `/api/operations/sku/mixes`;
        const {mix} = await fetchJSON<{mix:ProductMixInfo}>(url, {
            method: 'POST',
            body: JSON.stringify(arg),
        });
        return mix;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postMix()", err.message);
            return Promise.reject(err);
        }
        console.debug("postMix()", err);
        return Promise.reject(new Error('Error in postMix()'));
    }
}
