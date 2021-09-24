import {combineReducers} from "redux";
import {ProductMix, ProductMixField, ProductSorterProps} from "../../types";
import {ActionInterface, ActionPayload} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {itemsFilterInactiveChanged, itemsSearchChanged} from "../items";
import {productMixKey, productMixSorter, defaultMixSort} from "./utils";

export interface MixesPayload extends ActionPayload {
    list?: ProductMix[],
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

export const mixChanged = 'mixes/selected/mixChanged';
export const fetchMixRequested = 'mixes/selected/fetchRequested';
export const fetchMixSucceeded = 'mixes/selected/fetchSucceeded';
export const fetchMixFailed = 'mixes/selected/fetchFailed';

export const saveMixRequested = 'mixes/selected/saveRequested';
export const saveMixSucceeded = 'mixes/selected/saveSucceeded';
export const saveMixFailed = 'mixes/selected/saveFailed';


export const searchChangedAction = (search: string) => ({type: mixesSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: mixesFilterInactiveChanged});

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
    case fetchMixesSucceeded:
        if (payload?.list) {
            return [...payload.list].sort(productMixSorter(defaultMixSort));
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
