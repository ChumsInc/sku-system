import {ProductColorUPC, ProductColorUPCResponse} from 'chums-types';
import {fetchJSON} from "chums-components";

export const defaultColorUPC: ProductColorUPCResponse = {
    company: 'chums',
    id: 0,
    ItemCode: '',
    ItemCodeDesc: '',
    upc: '',
    notes: '',
    tags: {},
    ProductType: 'D',
    InactiveItem: 'N',
    UDF_UPC: '',
    UDF_UPC_BY_COLOR: '',
    active: true,
}

export async function fetchColorUPC(id:number):Promise<ProductColorUPCResponse|null> {
    try {
        if (!id) {
            return {...defaultColorUPC}
        }
        const url = `/api/operations/sku/by-color/${encodeURIComponent(id)}`;
        const res = await fetchJSON<{list:ProductColorUPCResponse[]}>(url, {cache: 'no-cache'});
        return res?.list[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchColorUPC()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchColorUPC()", err);
        return Promise.reject(new Error('Error in fetchColorUPC()'));
    }
}

export async function fetchColorUPCList():Promise<ProductColorUPCResponse[]> {
    try {
        const url = `/api/operations/sku/by-color`;
        const res = await fetchJSON<{list:ProductColorUPCResponse[]}>(url, {cache: 'no-cache'});
        return res?.list ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchColorUPCList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchColorUPCList()", err);
        return Promise.reject(new Error('Error in fetchColorUPC()'));
    }
}

export async function postColorUPC(arg:ProductColorUPC):Promise<ProductColorUPCResponse|null> {
    try {
        let upc = arg.upc;
        if (!upc) {
            const res = await fetchJSON<{nextUPC:string}>('/api/operations/sku/by-color/next', {cache: 'no-cache'});
            if (!res?.nextUPC) {
                return Promise.reject(new Error('Unable to fetch next UPC'));
            }
            upc = res?.nextUPC;
        }
        const res = await fetchJSON<{colorUPC:ProductColorUPCResponse}>('/api/operations/sku/by-color', {
            method: 'POST',
            body: JSON.stringify({...arg, upc})
        });
        return res?.colorUPC ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postColorUPC()", err.message);
            return Promise.reject(err);
        }
        console.debug("postColorUPC()", err);
        return Promise.reject(new Error('Error in postColorUPC()'));
    }
}
