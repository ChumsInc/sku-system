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
        const {nextUPC} = await fetchJSON<{ nextUPC: string }>('/api/operations/sku/by-color/next', {cache: 'no-cache'});
        await fetchJSON('/api/operations/sku/by-color', {
            method: 'POST',
            body: JSON.stringify({company, ItemCode, upc: nextUPC})
        });
        await fetchJSON('/sage/api/item-upc.php', {
            method: 'POST',
            body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC, action: 'update'})
        })
        const {item} = await fetchJSON<{ item: Product }>('/api/operations/sku/by-color/update-item', {
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
