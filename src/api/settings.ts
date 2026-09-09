import type {SettingsResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";


export async function fetchSettings(): Promise<SettingsResponse|null> {
    try {
        const url = '/api/operations/product-master/v2/settings.json';
        const res = await fetchJSON<{settings: SettingsResponse}>(url, {cache: "no-cache"});
        return res?.settings ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSettings()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSettings()", err);
        return Promise.reject(new Error('Error in fetchSettings()'));
    }
}
