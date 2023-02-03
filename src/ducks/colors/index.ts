import {combineReducers} from "redux";
import {defaultColorSort, productColorSorter} from "./utils";
import {SortProps} from "chums-components";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {fetchProductColor, fetchProductColorsList, postProductColor} from "../../api/color";
import {selectIsAdmin} from "../users";
import {RootState} from "../../app/configureStore";
import {ProductColor} from "chums-types";

export interface ColorsListState {
    colors: ProductColor[],
    search: string;
    filterInactive: boolean;
    loading: QueryStatus;
    loaded: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ProductColor>,
}

const initialColorsListState = (): ColorsListState => ({
    colors: [],
    search: '',
    filterInactive: true,
    loading: QueryStatus.uninitialized,
    loaded: false,
    page: 0,
    rowsPerPage: getPreference<number>(localStorageKeys.colorsRowsPerPage, 25),
    sort: {...defaultColorSort},
});

export interface SelectedColorState {
    color: ProductColor | null;
    loading: QueryStatus;
    saving: QueryStatus;
}

const initialSelectColorsState: SelectedColorState = {
    color: null,
    loading: QueryStatus.uninitialized,
    saving: QueryStatus.uninitialized,
}


export const setSearch = createAction<string>('colors/list/setSearch');

export const toggleFilterInactive = createAction<boolean | undefined>('colors/list/toggleFilterInactive');

export const setPage = createAction<number>('colors/list/setPage');
export const setRowsPerPage = createAction<number>('colors/list/setRowsPerPage');
export const setSort = createAction<SortProps<ProductColor>>('colors/list/setSort');

export const loadColorsList = createAsyncThunk<ProductColor[]>(
    'colors/list/load',
    async () => {
        return await fetchProductColorsList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadProductColor = createAsyncThunk<ProductColor | null, ProductColor>(
    'colors/selected/load',
    async (arg) => {
        return await fetchProductColor(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)
export const saveProductColor = createAsyncThunk<ProductColor, ProductColor>(
    'colors/selected/save',
    async (arg) => {
        return await postProductColor(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectCurrentColorLoading(state) && !selectCurrentColorSaving(state);
        }
    }
)

export const selectColorsList = (state: RootState) => state.colors.list.colors;
export const selectColorsListLoaded = (state:RootState) => state.colors.list.loaded;

export const selectColorsCount = (state: RootState) => state.colors.list.colors.length;
export const selectActiveColorsCount = (state: RootState) => state.colors.list.colors.filter(color => color.active).length;
export const selectSearch = (state: RootState) => state.colors.list.search;
export const selectFilterInactive = (state: RootState) => state.colors.list.filterInactive;
export const selectSort = (state: RootState) => state.colors.list.sort;

export const selectLoading = (state: RootState) => state.colors.list.loading === QueryStatus.pending;
export const selectCurrentColor = (state: RootState) => state.colors.selected.color;
export const selectCurrentColorLoading = (state: RootState) => state.colors.selected.loading === QueryStatus.pending;
export const selectCurrentColorSaving = (state: RootState) => state.colors.selected.saving === QueryStatus.pending;

export const selectFilteredColorsList = createSelector(
    [selectColorsList, selectSearch, selectFilterInactive, selectSort],
    (list, search, filterInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(color => !filterInactive || color.active)
            .filter(color => re.test(color.code) || re.test(color.description || ''))
            .sort(productColorSorter(sort));
    }
)

const colorsListReducer = createReducer(initialColorsListState, (builder) => {
    builder
        .addCase(loadColorsList.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadColorsList.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.colors = action.payload.sort(productColorSorter(defaultColorSort));
            state.loaded = true;
        })
        .addCase(loadColorsList.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadProductColor.fulfilled, (state, action) => {
            if (action.payload) {
                state.colors = [
                    ...state.colors.filter(color => color.id !== action.payload?.id),
                    action.payload,
                ].sort(productColorSorter(defaultColorSort));
            }
        })
        .addCase(saveProductColor.fulfilled, (state, action) => {
            state.colors = [
                ...state.colors.filter(color => color.id !== action.payload?.id),
                action.payload,
            ].sort(productColorSorter(defaultColorSort));
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(toggleFilterInactive, (state, action) => {
            state.filterInactive = action.payload ?? !state.filterInactive;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            setPreference<number>(localStorageKeys.colorsRowsPerPage, action.payload);
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
        })
});

const selectedColorReducer = createReducer(initialSelectColorsState, (builder) => {
    builder
        .addCase(loadColorsList.fulfilled, (state, action) => {
            const [color] = action.payload.filter(color => color.id === state.color?.id);
            if (color) {
                state.color = color;
            }
        })
        .addCase(loadProductColor.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadProductColor.fulfilled, (state, action) => {
            state.color = action.payload;
            state.loading = QueryStatus.fulfilled;
        })
        .addCase(loadProductColor.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveProductColor.pending, (state) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveProductColor.fulfilled, (state, action) => {
            state.color = action.payload;
            state.saving = QueryStatus.fulfilled;
        })
        .addCase(saveProductColor.rejected, (state, action) => {
            state.saving = QueryStatus.rejected;
        })
});

const colorsReducer = combineReducers({
    list: colorsListReducer,
    selected: selectedColorReducer,
});

export default colorsReducer;
