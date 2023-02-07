const reLocal = /^local/;


const sessionStoragePrefix:string = 'session/sku-system';
const localStoragePrefix:string = 'local/sku-system';


export const sessionStorageKeys = {
};

export const localStorageKeys = {
    categoriesRowsPerPage: `${localStoragePrefix}/categoriesRowsPerPage`,
    colorsRowsPerPage: `${localStoragePrefix}/colorsRowsPerPage`,
    colorUPCRowsPerPage: `${localStoragePrefix}/colorUPCRowsPerPage`,
    itemsRowsPerPage: `${localStoragePrefix}/itemsRowsPerPage`,
    groupsRowsPerPage: `${localStoragePrefix}/categoriesRowsPerPage`,
    mixesRowsPerPage: `${localStoragePrefix}/categoriesRowsPerPage`,
    skuListRowsPerPage: `${localStoragePrefix}/skuListRowsPerPage`,

    categoriesShowInactive: `${localStoragePrefix}/categoriesShowInactive`,
    colorsShowInactive: `${localStoragePrefix}/colorsShowInactive`,
    colorUPCShowInactive: `${localStoragePrefix}/colorUPCShowInactive`,
    itemsShowInactive: `${localStoragePrefix}/itemsShowInactive`,
    mixesShowInactive: `${localStoragePrefix}/mixesShowInactive`,
    skuListShowInactive: `${localStoragePrefix}/skuListShowInactive`,
    groupListShowInactive: `${localStoragePrefix}/groupListShowInactive`,
}

function getStorage(key:string):Storage {
    return reLocal.test(key) ? window.localStorage : window.sessionStorage;
}

export const setPreference = <T = any>(key:string, value:T) => {
    try {
        if (!global.window) {
            return;
        }
        getStorage(key).setItem(key, JSON.stringify(value));
    } catch(err:any) {
        console.log("setPreference()", err.message);
    }
};

export const clearPreference = (key:string) => {
    if (typeof window === 'undefined') {
        return;
    }
    getStorage(key).removeItem(key);
}

export const getPreference = <T = any>(key:string, defaultValue: T):T => {
    try {
        if (!global.window) {
            return defaultValue;
        }
        const value = getStorage(key).getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value);
    } catch(err:any) {
        console.log("getPreference()", err.message);
        return defaultValue;
    }
};
