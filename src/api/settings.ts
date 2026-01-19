import {SettingsResponse} from "../types";
import {fetchJSON} from "chums-components";


export async function fetchSettings(): Promise<SettingsResponse|null> {
    try {
        const url = '/api/operations/product-master/settings/chums';
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
