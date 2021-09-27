import {combineReducers} from "redux";
import {ProductColor, ProductColorField, ProductMix, ProductMixField, ProductSorterProps} from "../../types";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {itemsFilterInactiveChanged, itemsSearchChanged} from "../items";
import {productMixKey, productMixSorter, defaultMixSort} from "./utils";
import {
    colorChanged,
    colorSelected,
    ColorsThunkAction, defaultProductColor, fetchColorFailed, fetchColorRequested,
    fetchColorsFailed,
    fetchColorsRequested,
    fetchColorsSucceeded, fetchColorSucceeded, saveColorFailed, saveColorRequested, saveColorSucceeded
} from "../colors";
import {fetchSettingsSucceeded} from "../settings";

export interface MixesPayload extends ActionPayload {
    mixes?: ProductMix[],
    mix?: ProductMix,
    search?: string,
    field?: ProductMixField,
    value?: unknown
}

export interface MixesAction extends ActionInterface {
    payload?: MixesPayload,
}

export interface MixesThunkAction extends ThunkAction<any, RootState, unknown, MixesAction> {
}

export const defaultProductMix: ProductMix = {
    id: 0,
    code: '',
    description: '',
    notes: null,
    tags: {},
    active: true,
}

export const mixesSearchChanged = 'mixes/searchChanged';
export const mixesFilterInactiveChanged = 'mixes/filterInactiveChanged';

export const fetchMixesRequested = 'mixes/fetchRequested';
export const fetchMixesSucceeded = 'mixes/fetchSucceeded';
export const fetchMixesFailed = 'mixes/fetchFailed';

export const mixSelected = 'mixes/selected'
export const mixChanged = 'mixes/selected/mixChanged';

export const fetchMixRequested = 'mixes/selected/fetchRequested';
export const fetchMixSucceeded = 'mixes/selected/fetchSucceeded';
export const fetchMixFailed = 'mixes/selected/fetchFailed';

export const saveMixRequested = 'mixes/selected/saveRequested';
export const saveMixSucceeded = 'mixes/selected/saveSucceeded';
export const saveMixFailed = 'mixes/selected/saveFailed';


export const searchChangedAction = (search: string) => ({type: mixesSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: mixesFilterInactiveChanged});
export const mixChangedAction = (field:ProductMixField, value: unknown) => ({type: mixChanged, payload: {field, value}});

export const fetchListAction = ():MixesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: fetchMixesRequested});
            const url = buildPath('/api/operations/sku/mixes',);
            const {list} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: fetchMixesSucceeded, payload: {mixes: list || []}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchListAction()", error.message);
                return dispatch({type:fetchMixesFailed, payload: {error, context: fetchMixesRequested}})
            }
            console.error("fetchListAction()", error);
        }
    }

export const fetchMixAction = (mix:ProductMix):MixesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            if (!mix.id) {
                return dispatch({type: mixSelected, payload: {mix}});
            }
            dispatch({type: fetchMixRequested, payload: {mix}});
            const url = buildPath('/api/operations/sku/mixes/:id', {id: mix.id});
            const {list} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: fetchMixSucceeded, payload: {mix: list[0] || defaultProductMix}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchMixAction()", error.message);
                return dispatch({type:fetchMixFailed, payload: {error, context: fetchMixRequested}})
            }
            console.error("fetchMixAction()", error);
        }
    }

export const saveMixAction = (mix:ProductMix):MixesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: saveMixRequested});
            const url = buildPath('/api/operations/sku/colors/:id', {id: mix.id});
            const res = await fetchJSON(url, {method: 'POST', body: JSON.stringify(mix)});
            dispatch({type: saveMixSucceeded, payload: {mix: res.mix}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("saveMixAction()", error.message);
                return dispatch({type:saveMixFailed, payload: {error, context: saveMixRequested}})
            }
            console.error("saveMixAction()", error);
        }
    }

export const selectMixesList = (sort: ProductSorterProps) => (state: RootState): ProductMix[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }
    return state.mixes.list
        .filter(mix => !filterInactive || mix.active)
        .filter(mix => re.test(mix.code) || re.test(mix.description || ''));
}
export const selectMixesCount = (state: RootState) => state.mixes.list.length;
export const selectActiveMixesCount = (state: RootState) => state.mixes.list.filter(mix => mix.active).length;
export const selectSearch = (state: RootState) => state.mixes.search;
export const selectFilterInactive = (state: RootState) => state.mixes.filterInactive;
export const selectLoading = (state: RootState) => state.mixes.loading;
export const selectMix = (state: RootState) => state.mixes.selected;
export const selectMixLoading = (state: RootState) => state.mixes.selectedLoading;
export const selectMixSaving = (state: RootState) => state.mixes.selectedSaving;

const searchReducer = (state: string = '', action: MixesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case itemsSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: MixesAction): boolean => {
    switch (action.type) {
    case itemsFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: ProductMix[] = [], action: MixesAction): ProductMix[] => {
    const {type, payload} = action;
    switch (type) {
    case fetchSettingsSucceeded:
    case fetchMixesSucceeded:
        if (payload?.mixes) {
            return [...payload.mixes].sort(productMixSorter(defaultMixSort));
        }
        return state;
    case fetchMixSucceeded:
    case saveMixSucceeded:
        if (payload?.mix) {
            return [
                ...state.filter(mix => mix.id !== payload.mix?.id),
                payload.mix,
            ].sort(productMixSorter(defaultMixSort));
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: MixesAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchMixesRequested:
        return true;
    case fetchMixesSucceeded:
    case fetchMixesFailed:
        return false;
    default:
        return state;
    }
};


const selectedLoadingReducer = (state: boolean = false, action: MixesAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchMixRequested:
        return true;
    case fetchMixesSucceeded:
    case fetchMixFailed:
        return false;
    default:
        return state;
    }
};

const selectedReducer = (state: ProductMix = defaultProductMix, action: MixesAction): ProductMix => {
    const {type, payload} = action;
    switch (type) {
    case fetchMixRequested:
    case fetchMixSucceeded:
        if (payload?.mix) {
            return payload.mix;
        }
        return defaultProductMix;
    case mixChanged:
        if (payload?.field) {
            return {...state, [payload.field]: payload.value}
        }
        return state;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: MixesAction): boolean => {
    const {type} = action;
    switch (type) {
    case saveMixRequested:
        return true;
    case saveMixFailed:
    case saveMixSucceeded:
        return false;
    default:
        return state;
    }
};


export default combineReducers({
    list: listReducer,
    search: searchReducer,
    filterInactive: filterInactiveReducer,
    loading: loadingReducer,
    selected: selectedReducer,
    selectedLoading: selectedLoadingReducer,
    selectedSaving: selectedSavingReducer,
})
