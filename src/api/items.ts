import {BaseSKU} from "chums-types";
import {Product} from "../types";
import {fetchJSON} from "chums-components";

export async function fetchSKUItems(arg: BaseSKU|null): Promise<Product[]> {
    try {
        if (!arg) {
            return [];
        }
        const url = `/api/operations/sku/${encodeURIComponent(arg.sku)}`
        const {list} = await fetchJSON<{ list: Product[] }>(url, {cache: 'no-cache'});
        return list ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSKUItems()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSKUItems()", err);
        return Promise.reject(new Error('Error in fetchSKUItems()'));
    }
}

export async function postAssignNextColorUPC(arg: Product): Promise<Product> {
    try {
        const {company, ItemCode, UDF_UPC_BY_COLOR, InactiveItem, ProductType} = arg;
        const params = new URLSearchParams();
        params.set('company', company);
        params.set('itemCode', ItemCode);
        const url = `/api/operations/sku/by-color/item.json?${params.toString()}`
        let nextUPC:string|null = null;
        const res1 = await fetchJSON<{nextUPC:string}>(url, {cache: 'no-cache'});
        if (res1.nextUPC) {
            nextUPC = res1.nextUPC;
        } else {
            const res2 = await fetchJSON<{ nextUPC: string }>('/api/operations/sku/by-color/next.json', {cache: 'no-cache'});
            if (res2.nextUPC) nextUPC = res2.nextUPC;
            await fetchJSON('/api/operations/sku/by-color.json', {
                method: 'POST',
                body: JSON.stringify({company, ItemCode, upc: nextUPC})
            });
        }
        if (!nextUPC) {
            return Promise.reject(new Error('No next UPC found'));
        }
        await fetchJSON('/sage/api/item-upc.php', {
            method: 'POST',
            body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC, action: 'update'})
        })
        const {item} = await fetchJSON<{ item: Product }>('/api/operations/sku/by-color/update-item.json', {
            method: 'POST',
            body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC})
        });
        return item;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postAssignNextColorUPC()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAssignNextColorUPC()", err);
        return Promise.reject(new Error('Error in postAssignNextColorUPC()'));
    }
}
