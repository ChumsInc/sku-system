import {fetchJSON} from "chums-components";

export async function fetchIsAdmin():Promise<boolean> {
    try {
        const res = await fetchJSON<{success: boolean}>('/api/user/validate/role/inventory_admin');
        return res?.success ?? false;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchIsAdmin()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchIsAdmin()", err);
        return Promise.reject(new Error('Error in fetchIsAdmin()'));
    }
}
