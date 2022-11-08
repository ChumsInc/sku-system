import {combineReducers} from "redux";
import {ColorUPC, ColorUPCField, ColorUPCSorterProps, ProductColorField} from "../../types";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {colorUPCSorter, defaultColorUPCSort} from "./utils";
import {selectIsAdmin} from "../users";

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

const searchChanged = 'colorUPC/searchChanged';
const filterInactiveChanged = 'colorUPC/filterInactiveChanged';

const fetchListRequested = 'colorUPC/fetchListRequested';
const fetchListSucceeded = 'colorUPC/fetchListSucceeded';
const fetchListFailed = 'colorUPC/fetchListFailed';

const colorUPCSelected = 'colorUPC/selected'
const colorUPCChanged = 'colorUPC/selected/changed';

const fetchColorUPCRequested = 'colorUPC/selected/fetchRequested';
const fetchColorUPCSucceeded = 'colorUPC/selected/fetchSucceeded';
const fetchColorUPCFailed = 'colorUPC/selected/fetchFailed';

const saveColorUPCRequested = 'colorUPC/selected/saveRequested';
const saveColorUPCSucceeded = 'colorUPC/selected/saveSucceeded';
const saveColorUPCFailed = 'colorUPC/selected/saveFailed';


export const searchChangedAction = (search: string) => ({type: searchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: filterInactiveChanged});
export const colorUPChangedAction = (field: ColorUPCField, value: unknown) => ({
    type: colorUPCChanged,
    payload: {field, value}
});


export const fetchColorUPCAction = (colorUPC: ColorUPC): ColorUPCThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            if (!colorUPC.id) {
                return dispatch({type: colorUPCSelected, payload: {colorUPC}});
            }
            dispatch({type: fetchColorUPCRequested});
            const url = buildPath('/api/operations/sku/by-color/:id', {id: colorUPC.id});
            const {list = []} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: fetchColorUPCSucceeded, payload: {colorUPC: list[0] || fetchColorUPCRequested}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchColorUPCAction()", error.message);
                return dispatch({type: fetchColorUPCFailed, payload: {error, context: fetchColorUPCRequested}})
            }
            console.error("fetchColorUPCAction()", error);
        }
    };

export const fetchListAction = (): ColorUPCThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: fetchListRequested});
            const {list = []} = await fetchJSON('/api/operations/sku/by-color', {cache: 'no-cache'});
            dispatch({type: fetchListSucceeded, payload: {list}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchListAction()", error.message);
                return dispatch({type: fetchListFailed, payload: {error, context: fetchListRequested}})
            }
            console.error("fetchListAction()", error);
        }
    };

export const saveColorUPCAction = (colorUPC: ColorUPC): ColorUPCThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (!selectIsAdmin(state) || selectLoading(state) || selectSaving(state)) {
                return;
            }
            if (!colorUPC.upc) {
                const {nextUPC} = await fetchJSON('/api/operations/sku/by-color/next', {cache: 'no-cache'});
                colorUPC.upc = nextUPC;
            }
            dispatch({type: saveColorUPCRequested});
            const response = await fetchJSON('/api/operations/sku/by-color', {
                method: 'POST',
                body: JSON.stringify(colorUPC)
            });
            dispatch({type: saveColorUPCSucceeded, payload: {colorUPC: response.colorUPC}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveColorUPCAction()", error.message);
                return dispatch({type: saveColorUPCFailed, payload: {error, context: saveColorUPCRequested}})
            }
            console.error("saveColorUPCAction()", error);
        }
    };


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
            || re.test(color.notes || '')
            || re.test(color.upc || '')
            || re.test(color.UDF_UPC_BY_COLOR || ''))
        .sort(colorUPCSorter(sort));
}
export const selectColorUPCCount = (state: RootState) => state.colorUPC.list.length;
export const selectActiveColorUPCCount = (state: RootState) => state.colorUPC.list.filter(item => item.active).length;
export const selectSearch = (state: RootState) => state.colorUPC.search;
export const selectFilterInactive = (state: RootState) => state.colorUPC.filterInactive;
export const selectLoading = (state: RootState) => state.colorUPC.loading;
export const selectColorUPC = (state: RootState) => state.colorUPC.selected;
export const selectColorUPCLoading = (state: RootState) => state.colorUPC.selectedLoading;
export const selectSaving = (state: RootState) => state.colorUPC.selectedSaving;


const searchReducer = (state: string = '', action: ColorUPCAction): string => {
    const {type, payload} = action;
    switch (type) {
    case searchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: ColorUPCAction): boolean => {
    switch (action.type) {
    case filterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: ColorUPC[] = [], action: ColorUPCAction): ColorUPC[] => {
    const {type, payload} = action;
    switch (type) {
    case fetchListSucceeded:
        if (payload?.list) {
            return [...payload.list].sort(colorUPCSorter(defaultColorUPCSort));
        }
        return state;
    case fetchColorUPCSucceeded:
    case saveColorUPCSucceeded:
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
    case fetchListRequested:
        return true;
    case fetchListSucceeded:
    case fetchListFailed:
        return false;
    default:
        return state;
    }
};


const selectedLoadingReducer = (state: boolean = false, action: ColorUPCAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchColorUPCRequested:
        return true;
    case fetchColorUPCSucceeded:
    case fetchColorUPCFailed:
        return false;
    default:
        return state;
    }
};

const selectedReducer = (state: ColorUPC = defaultColorUPC, action: ColorUPCAction): ColorUPC => {
    const {type, payload} = action;
    switch (type) {
    case fetchColorUPCRequested:
    case fetchColorUPCSucceeded:
    case saveColorUPCSucceeded:
        if (payload?.colorUPC) {
            return payload.colorUPC;
        }
        return defaultColorUPC;
    case colorUPCChanged:
        if (payload?.field) {
            return {...state, [payload.field]: payload.value}
        }
        return state;
    case colorUPCSelected:
        if (payload?.colorUPC) {
            return {...payload.colorUPC};
        }
        return state;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: ColorUPCAction): boolean => {
    const {type} = action;
    switch (type) {
    case saveColorUPCRequested:
        return true;
    case saveColorUPCSucceeded:
    case saveColorUPCFailed:
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
