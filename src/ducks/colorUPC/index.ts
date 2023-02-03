import {colorUPCSorter} from "./utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SortProps} from "chums-components";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchColorUPC, fetchColorUPCList, postColorUPC} from "../../api/colorUPC";
import {RootState} from "../../app/configureStore";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {selectIsAdmin} from "../users";
import {ProductColorUPCResponse} from "chums-types";


export const defaultColorUPCSort: SortProps<ProductColorUPCResponse> = {field: "id", ascending: true}

export interface ColorUPCState {
    list: ProductColorUPCResponse[],
    search: string;
    filterInactive: boolean;
    loading: QueryStatus;
    selected: ProductColorUPCResponse | null;
    selectedLoading: QueryStatus;
    saving: QueryStatus;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ProductColorUPCResponse>,
}

export const initialColorUPCState: ColorUPCState = {
    list: [],
    search: '',
    filterInactive: true,
    loading: QueryStatus.uninitialized,
    selected: null,
    selectedLoading: QueryStatus.uninitialized,
    saving: QueryStatus.uninitialized,
    page: 0,
    rowsPerPage: getPreference<number>(localStorageKeys.colorUPCRowsPerPage, 25),
    sort: {...defaultColorUPCSort},
}

export const searchChanged = createAction<string>('colorUPC/searchChanged');
export const toggleFilterInactive = createAction<boolean | undefined>('colorUPC/toggleFilterInactive');

export const setPage = createAction<number>('colorUPC/setPage');
export const setRowsPerPage = createAction<number>('colorUPC/setRowsPerPage');

export const setSort = createAction<SortProps<ProductColorUPCResponse>>('colorUPC/setSort');


export const loadColorUPC = createAsyncThunk<ProductColorUPCResponse | null, ProductColorUPCResponse>(
    'colorUPC/load',
    async (arg) => {
        return await fetchColorUPC(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            return true;
        }
    }
);

export const loadColorUPCList = createAsyncThunk<ProductColorUPCResponse[]>(
    'colorUPC/loadList',
    async () => {
        return await fetchColorUPCList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const saveColorUPC = createAsyncThunk<ProductColorUPCResponse, ProductColorUPCResponse>(
    'colorUPC/save',
    async (arg,) => {
        return postColorUPC(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectLoading(state) && !selectSaving(state);
        }
    }
)

export const selectList = (state: RootState) => state.colorUPC.list;
export const selectColorUPCCount = (state: RootState) => state.colorUPC.list.length;
export const selectActiveColorUPCCount = (state: RootState) => state.colorUPC.list.filter(item => item.active).length;
export const selectSearch = (state: RootState) => state.colorUPC.search;
export const selectFilterInactive = (state: RootState) => state.colorUPC.filterInactive;
export const selectLoading = (state: RootState) => state.colorUPC.loading === QueryStatus.pending;
export const selectColorUPC = (state: RootState) => state.colorUPC.selected;
export const selectColorUPCLoading = (state: RootState) => state.colorUPC.selectedLoading === QueryStatus.pending;
export const selectSaving = (state: RootState) => state.colorUPC.saving === QueryStatus.pending;
export const selectSort = (state: RootState) => state.colorUPC.sort;

export const selectPage = (state: RootState) => state.colorUPC.page;

export const selectRowsPerPage = (state: RootState) => state.colorUPC.rowsPerPage;

export const selectColorUPCList = createSelector(
    [selectList, selectSearch, selectFilterInactive, selectSort],
    (list, search, filterInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return list
            .filter(upc => !filterInactive || upc.active)
            .filter(upc => re.test(upc.ItemCode)
                || re.test(upc.ItemCodeDesc || '')
                || re.test(upc.notes || '')
                || re.test(upc.upc || '')
                || re.test(upc.UDF_UPC_BY_COLOR || ''))
            .sort(colorUPCSorter(sort));
    }
)


const colorUPCReducer = createReducer(initialColorUPCState, (builder) => {
    builder
        .addCase(searchChanged, (state, action) => {
            state.search = action.payload;
        })
        .addCase(toggleFilterInactive, (state, action) => {
            state.filterInactive = action.payload ?? !state.filterInactive;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            setPreference<number>(localStorageKeys.colorUPCRowsPerPage, action.payload)
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(loadColorUPCList.pending, (state, action) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadColorUPCList.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.list = action.payload.sort(colorUPCSorter(defaultColorUPCSort));
        })
        .addCase(loadColorUPCList.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadColorUPC.pending, (state, action) => {
            state.selectedLoading = QueryStatus.pending;
        })
        .addCase(loadColorUPC.fulfilled, (state, action) => {
            state.selected = action.payload;
            state.selectedLoading = QueryStatus.fulfilled;

            if (action.payload && action.payload.id) {
                state.list = [
                    ...state.list = state.list.filter(row => row.id !== action.meta.arg.id),
                    action.payload
                ].sort(colorUPCSorter(defaultColorUPCSort));
            }
        })
        .addCase(loadColorUPC.rejected, (state) => {
            state.selectedLoading = QueryStatus.rejected;
        })
        .addCase(saveColorUPC.pending, (state, action) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveColorUPC.fulfilled, (state, action) => {
            state.selected = action.payload;
            state.saving = QueryStatus.fulfilled;

            if (action.payload) {
                state.list = [
                    ...state.list = state.list.filter(row => row.id !== action.meta.arg.id),
                    action.payload
                ].sort(colorUPCSorter(defaultColorUPCSort));
            }
        })
        .addCase(saveColorUPC.rejected, (state) => {
            state.saving = QueryStatus.rejected;
        })
});

export default colorUPCReducer;
