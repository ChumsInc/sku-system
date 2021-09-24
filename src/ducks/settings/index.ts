import {combineReducers} from "redux";
import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {
    CountryOfOrigin,
    PrimaryVendor,
    ProductCategory,
    ProductColor,
    ProductLine,
    ProductMix,
    ProductSeason,
    ProductSKU,
    ProductSubCategory,
    ProductWarehouse,
    SKUGroup
} from "../../types";

export interface SettingsPayload extends ActionPayload {
    categories?: ProductCategory[],
    colors?: ProductColor[],
    countryOfOrigin?: CountryOfOrigin[],
    productLines?: ProductLine[],
    mixes?: ProductMix[],
    primaryVendor?: PrimaryVendor[],
    seasons?: ProductSeason[],
    skuGroups?: SKUGroup[],
    skuList?: ProductSKU[],
    subCategories?: ProductSubCategory[],
    warehouses?: ProductWarehouse[],
}

export interface SettingsAction extends ActionInterface {
    payload?: SettingsPayload,
}

export interface SettingsThunkAction extends ThunkAction<any, RootState, unknown, SettingsAction> {
}

export const settingsFetchRequested = 'settings/fetchRequested';
export const fetchSettingsSucceeded = 'settings/fetchSucceeded';
export const fetchSettingsFailed = 'settings/fetchFailed';

export const fetchSettingsAction = (company: string = 'chums'): SettingsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: settingsFetchRequested});
            const url = '/api/operations/production/pm/settings/:company'
                .replace(':company', encodeURIComponent(company));
            const {settings} = await fetchJSON(url, {cache: "no-cache"});
            const {
                categories = [],
                colors = [],
                countryOfOrigin = [],
                lines: productLines = [],
                mixes = [],
                primaryVendor = [],
                seasons = [],
                skuGroups = [],
                skuList = [],
                status: productStatus = [],
                subCategories = [],
                warehouses = [],
            } = settings
            dispatch({
                type: fetchSettingsSucceeded, payload: {
                    categories,
                    colors, productLines, mixes, skuList, skuGroups, subCategories
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchSettingsAction()", error.message);
                return dispatch({type: fetchSettingsFailed, payload: {error, context: settingsFetchRequested}})
            }
            console.error("fetchSettingsAction()", error);
        }
    };

export const selectLoading = (state: RootState) => state.settings.loading;
export const selectCategoryList = (state: RootState) => state.settings.categories;
export const selectColorList = (state: RootState) => state.settings.colors;
export const selectProductLineList = (state: RootState) => state.settings.productLines;
export const selectMixList = (state: RootState) => state.settings.mixes;
export const selectSKUList = (state: RootState) => state.settings.skuList;
export const selectSubCategoryList = (state: RootState) => state.settings.subCategories;


const loadingReducer = (state: boolean = false, action: SettingsAction): boolean => {
    switch (action.type) {
    case settingsFetchRequested:
        return true;
    case fetchSettingsSucceeded:
    case fetchSettingsFailed:
        return false;
    default:
        return state;
    }
}

const categoriesReducer = (state: ProductCategory[] = [], action: SettingsAction): ProductCategory[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.categories) {
            return [...payload.categories];
        }
        return state;
    default:
        return state;
    }
};

const productLinesReducer = (state: ProductLine[] = [], action: SettingsAction): ProductLine[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.productLines) {
            return [...payload.productLines];
        }
        return state;
    default:
        return state;
    }
};

const primaryVendorReducer = (state: PrimaryVendor[] = [], action: SettingsAction): PrimaryVendor[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.primaryVendor) {
            return [...payload.primaryVendor];
        }
        return state;
    default:
        return state;
    }
};

const subCategoriesReducer = (state: ProductSubCategory[] = [], action: SettingsAction): ProductSubCategory[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.subCategories) {
            return [...payload.subCategories];
        }
        return state;
    default:
        return state;
    }
};

const skuListReducer = (state: ProductSKU[] = [], action: SettingsAction): ProductSKU[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.skuList) {
            return [...payload.skuList];
        }
        return state;
    default:
        return state;
    }
};

const colorsReducer = (state: ProductColor[] = [], action: SettingsAction): ProductColor[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.colors) {
            return [...payload.colors];
        }
        return state;
    default:
        return state;
    }
};

const mixesReducer = (state: ProductMix[] = [], action: SettingsAction): ProductMix[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
        if (payload?.mixes) {
            return [...payload.mixes];
        }
        return state;
    default:
        return state;
    }
};

export default combineReducers({
    loading: loadingReducer,
    categories: categoriesReducer,
    productLines: productLinesReducer,
    subCategories: subCategoriesReducer,
    skuList: skuListReducer,
    colors: colorsReducer,
    mixes: mixesReducer,
});
