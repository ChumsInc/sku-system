import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchIsAdmin():Promise<boolean> {
    try {
        const res = await fetchJSON<{success: boolean}>('/api/user/v2/validate/role/inventory_admin.json');
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
