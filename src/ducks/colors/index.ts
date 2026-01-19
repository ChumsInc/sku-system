import {combineReducers} from "redux";
import {defaultColorSort, productColorSorter} from "./utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {fetchProductColor, fetchProductColorsList, postProductColor} from "../../api/color";
import {selectIsAdmin} from "../users";
import {RootState} from "../../app/configureStore";
import {ProductColor} from "chums-types";
import {
    createDefaultListActions,
    CurrentValueState,
    initialCurrentValueState,
    initialListState,
    ListState
} from "../redux-utils";
import {Root} from "react-dom/client";


const initialColorsListState = (): ListState<ProductColor> => ({
    ...initialListState,
    rowsPerPage: getPreference<number>(localStorageKeys.colorsRowsPerPage, 25),
    showInactive: getPreference<boolean>(localStorageKeys.colorsShowInactive, false),
    sort: {...defaultColorSort},
});

const initialSelectColorsState: CurrentValueState<ProductColor> = {
    ...initialCurrentValueState,
}

export const {
    setSearch,
    setPage,
    setRowsPerPage,
    setSort,
    toggleShowInactive
} = createDefaultListActions<ProductColor>('colors/list');

export const loadColorsList = createAsyncThunk<ProductColor[]>(
    'colors/list/load',
    async () => {
        return await fetchProductColorsList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectListLoading(state);
        }
    }
)

export const loadProductColor = createAsyncThunk<ProductColor | null, ProductColor>(
    'colors/current/load',
    async (arg) => {
        return await fetchProductColor(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectListLoading(state);
        }
    }
)
export const saveProductColor = createAsyncThunk<ProductColor|null, ProductColor>(
    'colors/current/save',
    async (arg) => {
        return await postProductColor(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectLoading(state) && !selectSaving(state);
        }
    }
)

export const selectColorsList = (state: RootState) => state.colors.list.values;
export const selectColorsListLoaded = (state: RootState) => state.colors.list.loaded;

export const selectInactiveCount = (state: RootState) => state.colors.list.values.filter(color => !color.active).length;
export const selectSearch = (state: RootState) => state.colors.list.search;
export const selectShowInactive = (state: RootState) => state.colors.list.showInactive;
export const selectSort = (state: RootState) => state.colors.list.sort;
export const selectPage = (state:RootState) => state.colors.list.page;
export const selectRowsPerPage = (state:RootState) => state.colors.list.rowsPerPage;

export const selectListLoading = (state: RootState) => state.colors.list.loading === QueryStatus.pending;

export const selectLoading = (state:RootState) => state.colors.current.loading === QueryStatus.pending;
export const selectSaving = (state:RootState) => state.colors.current.saving === QueryStatus.pending;
export const selectCurrentColor = (state: RootState) => state.colors.current.value;

export const selectFilteredColorsList = createSelector(
    [selectColorsList, selectSearch, selectShowInactive, selectSort],
    (list, search, showInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(color => showInactive || color.active)
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
            state.values = action.payload.sort(productColorSorter(defaultColorSort));
            state.loaded = true;
        })
        .addCase(loadColorsList.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadProductColor.fulfilled, (state, action) => {
            if (action.payload && action.payload.id) {
                state.values = [
                    ...state.values.filter(color => color.id !== action.payload?.id),
                    action.payload,
                ].sort(productColorSorter(defaultColorSort));
            }
        })
        .addCase(saveProductColor.fulfilled, (state, action) => {
            if (action.payload) {
                state.values = [
                    ...state.values.filter(color => color.id !== action.payload?.id),
                    action.payload,
                ].sort(productColorSorter(defaultColorSort));
            }
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
            setPreference<number>(localStorageKeys.colorsRowsPerPage, action.payload);
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
});

const selectedColorReducer = createReducer(initialSelectColorsState, (builder) => {
    builder
        .addCase(loadColorsList.fulfilled, (state, action) => {
            const [color] = action.payload.filter(color => color.id === state.value?.id);
            if (color) {
                state.value = color;
            }
        })
        .addCase(loadProductColor.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadProductColor.fulfilled, (state, action) => {
            state.value = action.payload;
            state.loading = QueryStatus.fulfilled;
        })
        .addCase(loadProductColor.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveProductColor.pending, (state) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveProductColor.fulfilled, (state, action) => {
            state.value = action.payload;
            state.saving = QueryStatus.fulfilled;
        })
        .addCase(saveProductColor.rejected, (state, action) => {
            state.saving = QueryStatus.rejected;
        })
});

const colorsReducer = combineReducers({
    list: colorsListReducer,
    current: selectedColorReducer,
});

export default colorsReducer;
