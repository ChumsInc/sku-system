import {combineReducers} from "redux";
import {ProductColor, ProductColorField, ProductSorterProps} from "../../types";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {defaultColorSort, productColorSorter} from "./utils";
import {fetchSettingsFailed, settingsFetchRequested, fetchSettingsSucceeded} from "../settings";

export interface ColorsPayload extends ActionPayload {
    colors?: ProductColor[],
    color?: ProductColor,
    search?: string,
    field?: ProductColorField,
    value?: unknown
}

export interface ColorsAction extends ActionInterface {
    payload?: ColorsPayload,
}

export interface ColorsThunkAction extends ThunkAction<any, RootState, unknown, ColorsAction> {
}

export const defaultProductColor: ProductColor = {
    id: 0,
    code: '',
    description: '',
    notes: null,
    tags: {},
    active: true,
}

export const colorsSearchChanged = 'colors/searchChanged';
export const colorsFilterInactiveChanged = 'colors/filterInactiveChanged';

export const colorSelected = 'colors/colorSelected';

export const fetchColorsRequested = 'colors/fetchRequested';
export const fetchColorsSucceeded = 'colors/fetchSucceeded';
export const fetchColorsFailed = 'colors/fetchFailed';

export const colorChanged = 'colors/selected/colorChanged';
export const fetchColorRequested = 'colors/selected/fetchRequested';
export const fetchColorSucceeded = 'colors/selected/fetchSucceeded';
export const fetchColorFailed = 'colors/selected/fetchFailed';

export const saveColorRequested = 'colors/selected/saveRequested';
export const saveColorSucceeded = 'colors/selected/saveSucceeded';
export const saveColorFailed = 'colors/selected/saveFailed';


export const searchChangedAction = (search: string) => ({type: colorsSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: colorsFilterInactiveChanged});

export const colorChangedAction = (field:ProductColorField, value: unknown) => ({type: colorChanged, payload: {field, value}});

export const fetchListAction = ():ColorsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: fetchColorsRequested});
            const url = buildPath('/api/operations/sku/colors',);
            const {list} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: fetchColorsSucceeded, payload: {colors: list || []}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchColorsAction()", error.message);
                return dispatch({type:fetchColorsFailed, payload: {error, context: fetchColorsRequested}})
            }
            console.error("fetchColorsAction()", error);
        }
}

export const fetchColorAction = (color:ProductColor):ColorsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            if (!color.id) {
                return dispatch({type: colorSelected, payload: {color}});
            }
            dispatch({type: fetchColorRequested, payload: {color}});
            const url = buildPath('/api/operations/sku/colors/:id', {id: color.id});
            const {list} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: fetchColorSucceeded, payload: {color: list[0] || defaultProductColor}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchColorsAction()", error.message);
                return dispatch({type:fetchColorFailed, payload: {error, context: fetchColorRequested}})
            }
            console.error("fetchColorsAction()", error);
        }
}

export const saveColorAction = (color:ProductColor):ColorsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: saveColorRequested});
            const url = buildPath('/api/operations/sku/colors/:id', {id: color.id});
            const res = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: saveColorSucceeded, payload: {color: res.color}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchColorsAction()", error.message);
                return dispatch({type:saveColorFailed, payload: {error, context: saveColorRequested}})
            }
            console.error("fetchColorsAction()", error);
        }
}


export const selectColorsList = (sort: ProductSorterProps) => (state: RootState): ProductColor[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }
    return state.colors.list
        .filter(color => !filterInactive || color.active)
        .filter(color => re.test(color.code) || re.test(color.description || ''));
}
export const selectColorsCount = (state: RootState) => state.colors.list.length;
export const selectSearch = (state: RootState) => state.colors.search;
export const selectFilterInactive = (state: RootState) => state.colors.filterInactive;
export const selectLoading = (state: RootState) => state.colors.loading;
export const selectColor = (state: RootState) => state.colors.selected;
export const selectColorLoading = (state: RootState) => state.colors.selectedLoading;
export const selectColorSaving = (state: RootState) => state.colors.selectedSaving;

const searchReducer = (state: string = '', action: ColorsAction): string => {
    const {type, payload} = action;
    switch (type) {
    case colorsSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: ColorsAction): boolean => {
    switch (action.type) {
    case colorsFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: ProductColor[] = [], action: ColorsAction): ProductColor[] => {
    const {type, payload} = action;
    switch (type) {
    case fetchSettingsSucceeded:
    case fetchColorsSucceeded:
        if (payload?.colors) {
            return [...payload.colors].sort(productColorSorter(defaultColorSort));
        }
        return state;
    case fetchColorSucceeded:
    case saveColorSucceeded:
        if (payload?.color) {
            return [
                ...state.filter(color => color.id !== payload.color?.id),
                payload.color,
            ].sort(productColorSorter(defaultColorSort));
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ColorsAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchColorsRequested:
    case settingsFetchRequested:
        return true;
    case fetchColorsSucceeded:
    case fetchColorsFailed:
    case fetchSettingsSucceeded:
    case fetchSettingsFailed:
        return false;
    default:
        return state;
    }
};


const selectedLoadingReducer = (state: boolean = false, action: ColorsAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchColorRequested:
        return true;
    case fetchColorsSucceeded:
    case fetchColorFailed:
        return false;
    default:
        return state;
    }
};

const selectedReducer = (state: ProductColor = defaultProductColor, action: ColorsAction): ProductColor => {
    const {type, payload} = action;
    switch (type) {
    case fetchColorRequested:
    case fetchColorSucceeded:
        if (payload?.color) {
            return payload.color;
        }
        return defaultProductColor;
    case colorChanged:
        if (payload?.field) {
            return {...state, [payload.field]: payload.value, changed: true}
        }
        return state;
    case colorSelected:
        return {...defaultProductColor};
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: ColorsAction): boolean => {
    const {type} = action;
    switch (type) {
    case saveColorRequested:
        return true;
    case saveColorFailed:
    case saveColorSucceeded:
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
