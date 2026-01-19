import {BaseSKU} from "chums-types";
import {Product} from "../types";
import {fetchJSON} from "chums-components";

export async function fetchSKUItems(arg: BaseSKU|null): Promise<Product[]> {
    try {
        if (!arg) {
            return [];
        }
        const url = `/api/operations/sku/${encodeURIComponent(arg.sku)}`
        const res = await fetchJSON<{ list: Product[] }>(url, {cache: 'no-cache'});
        return res?.list ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUItems()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUItems()", err);
        return Promise.reject(new Error('Error in fetchSKUItems()'));
    }
}

export async function postAssignNextColorUPC(arg: Product): Promise<Product|null> {
    try {
        const {company, ItemCode, UDF_UPC_BY_COLOR, InactiveItem, ProductType} = arg;
        let nextUPC:string|null = null;
        const params = new URLSearchParams();
        params.set('company', company);
        params.set('itemCode', ItemCode);
        const url0 = `/api/operations/sku/by-color/item.json?${params.toString()}`;
        const res0 = await fetchJSON<{ upc: string }>(url0, {cache: 'no-cache'});
        if (res0?.upc) {
            nextUPC = res0.upc;
        } else {
            const res = await fetchJSON<{ nextUPC: string }>('/api/operations/sku/by-color/next.json', {cache: 'no-cache'});
            nextUPC = res?.nextUPC;
            if (nextUPC) {
                await fetchJSON('/api/operations/sku/by-color.json', {
                    method: 'POST',
                    body: JSON.stringify({company, ItemCode, upc: nextUPC})
                });
            }
        }

        if (!nextUPC) {
            return Promise.reject(new Error('Unable to fetch next UPC'))
        }

        await fetchJSON('/sage/api/item-upc.php', {
            method: 'POST',
            body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC, action: 'update'})
        })
        const res2 = await fetchJSON<{ item: Product }>('/api/operations/sku/by-color/update-item.json', {
            method: 'POST',
            body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC})
        });
        return res2?.item ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postAssignNextColorUPC()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAssignNextColorUPC()", err);
        return Promise.reject(new Error('Error in postAssignNextColorUPC()'));
    }
}
