import {combineReducers} from "redux";
import {ProductMix, ProductMixField} from "../../types";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {defaultMixSort, productMixSorter} from "./utils";
import {fetchSettingsSucceeded} from "../settings";
import {SortProps} from "chums-components";
import {CurrentValueState, initialCurrentValueState, initialListState, ListState} from "../redux-utils";
import {ProductMixInfo} from "chums-types";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";

export const initialMixListState = ():ListState<ProductMixInfo> => ({
    ...initialListState,
    rowsPerPage: getPreference(localStorageKeys.mixesRowsPerPage, 25),
    sort: {...defaultMixSort},
});

const initialCurrentMixState:CurrentValueState<ProductMixInfo> = {
    ...initialCurrentValueState,
}

const listReducer = createReducer(initialMixListState, (builder) => {

});

const currentMixReducer = createReducer(initialCurrentMixState, (builder) => {

});

const mixesReducer = combineReducers({
    list: listReducer,
    current: currentMixReducer,
});

export default mixesReducer;


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
export const mixChangedAction = (field: ProductMixField, value: unknown) => ({
    type: mixChanged,
    payload: {field, value}
});

export const fetchListAction = (): MixesThunkAction =>
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadColorUPCList()", error.message);
                return dispatch({type: fetchMixesFailed, payload: {error, context: fetchMixesRequested}})
            }
            console.error("loadColorUPCList()", error);
        }
    }

export const fetchMixAction = (mix: ProductMix): MixesThunkAction =>
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchMixAction()", error.message);
                return dispatch({type: fetchMixFailed, payload: {error, context: fetchMixRequested}})
            }
            console.error("fetchMixAction()", error);
        }
    }

export const saveMixAction = (mix: ProductMix): MixesThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: saveMixRequested});
            let url = '/api/operations/sku/mixes';
            let method = 'POST';
            if (mix.id) {
                url = '/api/operations/sku/mixes/:id'.replace(':id', encodeURIComponent(mix.id));
                method = 'PUT';
            }
            const res = await fetchJSON(url, {method, body: JSON.stringify(mix)});
            dispatch({type: saveMixSucceeded, payload: {mix: res.mix}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveMixAction()", error.message);
                return dispatch({type: saveMixFailed, payload: {error, context: saveMixRequested}})
            }
            console.error("saveMixAction()", error);
        }
    }

export const selectMixesList = (sort: SortProps<ProductMix>) => (state: RootState): ProductMix[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }
    return state.mixes.list
        .filter(mix => !filterInactive || mix.active)
        .filter(mix => re.test(mix.code) || re.test(mix.description || '') || re.test(mix.notes || ''));
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
    case mixesSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: MixesAction): boolean => {
    switch (action.type) {
    case mixesFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const _listReducer = (state: ProductMix[] = [], action: MixesAction): ProductMix[] => {
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


// export default combineReducers({
//     list: _listReducer,
//     search: searchReducer,
//     filterInactive: filterInactiveReducer,
//     loading: loadingReducer,
//     selected: selectedReducer,
//     selectedLoading: selectedLoadingReducer,
//     selectedSaving: selectedSavingReducer,
// })
