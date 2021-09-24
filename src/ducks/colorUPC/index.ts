import {combineReducers} from "redux";
import {ColorUPC, ColorUPCSorterProps, ProductColorField} from "../../types";
import {ActionInterface, ActionPayload} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {colorUPCSorter, defaultColorUPCSort} from "./utils";

export interface ColorUPCPayload extends ActionPayload {
    list?: ColorUPC[],
    colorUPC?: ColorUPC,
    search?: string,
    field?: ProductColorField,
    value?: unknown
}

export interface ColorUPCAction extends ActionInterface {
    payload?: ColorUPCPayload,
}

export interface ColorUPCThunkAction extends ThunkAction<any, RootState, unknown, ColorUPCAction> {
}

export const defaultColorUPC: ColorUPC = {
    company: 'chums',
    id: 0,
    ItemCode: '',
    ItemCodeDesc: '',
    upc: '',
    notes: null,
    tags: {},
    ProductType: '',
    InactiveItem: 'N',
    UDF_UPC: '',
    UDF_UPC_BY_COLOR: '',
    active: true,
}

export const colorUPCSearchChanged = 'colorUPC/searchChanged';
export const colorUPCFilterInactiveChanged = 'colorUPC/filterInactiveChanged';

export const colorUPCFetchListRequested = 'colorUPC/fetchListRequested';
export const colorUPCFetchListSucceeded = 'colorUPC/fetchListSucceeded';
export const colorUPCFetchListFailed = 'colorUPC/fetchListFailed';

export const colorUPCChanged = 'colorUPC/selected/colorChanged';
export const colorUPCFetchRequested = 'colorUPC/fetchRequested';
export const colorUPCFetchSucceeded = 'colorUPC/fetchSucceeded';
export const colorUPCFetchFailed = 'colorUPC/fetchFailed';

export const colorUPCSaveRequested = 'colorUPC/saveRequested';
export const colorUPCSaveSucceeded = 'colorUPC/saveSucceeded';
export const colorUPCSaveFailed = 'colorUPC/saveFailed';


export const searchChangedAction = (search: string) => ({type: colorUPCSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: colorUPCFilterInactiveChanged});

export const selectColorUPCList = (sort: ColorUPCSorterProps) => (state: RootState): ColorUPC[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }
    return state.colorUPC.list
        .filter(color => !filterInactive || color.active)
        .filter(color => re.test(color.ItemCode)
            || re.test(color.ItemCodeDesc || '')
            || re.test(color.UDF_UPC_BY_COLOR || ''));
}
export const selectColorUPCCount = (state: RootState) => state.colorUPC.list.length;
export const selectSearch = (state: RootState) => state.colorUPC.search;
export const selectFilterInactive = (state: RootState) => state.colorUPC.filterInactive;
export const selectLoading = (state: RootState) => state.colorUPC.loading;
export const selectColor = (state: RootState) => state.colorUPC.selected;
export const selectColorLoading = (state: RootState) => state.colorUPC.selectedLoading;
export const selectColorUPCaving = (state: RootState) => state.colorUPC.selectedSaving;

const searchReducer = (state: string = '', action: ColorUPCAction): string => {
    const {type, payload} = action;
    switch (type) {
    case colorUPCSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: ColorUPCAction): boolean => {
    switch (action.type) {
    case colorUPCFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: ColorUPC[] = [], action: ColorUPCAction): ColorUPC[] => {
    const {type, payload} = action;
    switch (type) {
    case colorUPCFetchListSucceeded:
        if (payload?.list) {
            return [...payload.list].sort(colorUPCSorter(defaultColorUPCSort));
        }
        return state;
    case colorUPCFetchSucceeded:
    case colorUPCSaveSucceeded:
        if (payload?.colorUPC) {
            return [
                ...state.filter(upc => upc.id !== payload.colorUPC?.id),
                payload.colorUPC,
            ].sort(colorUPCSorter(defaultColorUPCSort));
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ColorUPCAction): boolean => {
    const {type} = action;
    switch (type) {
    case colorUPCFetchRequested:
        return true;
    case colorUPCFetchSucceeded:
    case colorUPCFetchFailed:
        return false;
    default:
        return state;
    }
};


const selectedLoadingReducer = (state: boolean = false, action: ColorUPCAction): boolean => {
    const {type} = action;
    switch (type) {
    case colorUPCFetchRequested:
        return true;
    case colorUPCFetchSucceeded:
    case colorUPCFetchFailed:
        return false;
    default:
        return state;
    }
};

const selectedReducer = (state: ColorUPC = defaultColorUPC, action: ColorUPCAction): ColorUPC => {
    const {type, payload} = action;
    switch (type) {
    case colorUPCFetchRequested:
    case colorUPCFetchSucceeded:
        if (payload?.colorUPC) {
            return payload.colorUPC;
        }
        return defaultColorUPC;
    case colorUPCChanged:
        if (payload?.field) {
            return {...state, [payload.field]: payload.value}
        }
        return state;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: ColorUPCAction): boolean => {
    const {type} = action;
    switch (type) {
    case colorUPCSaveRequested:
        return true;
    case colorUPCSaveSucceeded:
    case colorUPCSaveFailed:
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
