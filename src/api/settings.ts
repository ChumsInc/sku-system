import {SettingsResponse} from "../types";
import {fetchJSON} from "chums-components";


export async function fetchSettings(): Promise<SettingsResponse> {
    try {
        const url = '/api/operations/production/pm/settings/chums';
        const {settings} = await fetchJSON<{settings: SettingsResponse}>(url, {cache: "no-cache"});
        return settings;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSettings()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSettings()", err);
        return Promise.reject(new Error('Error in fetchSettings()'));
    }
}
