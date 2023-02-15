import {fetchJSON} from "chums-components";

export async function fetchVersion(): Promise<string> {
    try {
        const {version} = await fetchJSON<{ version: string }>('package.json', {cache: "no-cache"});
        return version;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
