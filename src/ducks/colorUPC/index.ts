import {colorUPCSorter} from "./utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SortProps} from "chums-components";
import {combineReducers, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchColorUPC, fetchColorUPCList, postColorUPC} from "../../api/colorUPC";
import {RootState} from "../../app/configureStore";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {selectIsAdmin} from "../users";
import {ProductColorUPCResponse} from "chums-types";
import {
    createDefaultListActions,
    CurrentValueState,
    initialCurrentValueState,
    initialListState,
    ListState
} from "../redux-utils";


export const defaultColorUPCSort: SortProps<ProductColorUPCResponse> = {field: "ItemCode", ascending: true}

const initialColorUPClListState = (): ListState<ProductColorUPCResponse> => ({
    ...initialListState,
    rowsPerPage: getPreference(localStorageKeys.colorUPCRowsPerPage, 25),
    showInactive: getPreference(localStorageKeys.colorUPCShowInactive, false),
    sort: defaultColorUPCSort,
})

const initialCurrentColorUPCState: CurrentValueState<ProductColorUPCResponse> = {
    ...initialCurrentValueState,
}

export const {
    setSearch,
    setPage,
    setRowsPerPage,
    toggleShowInactive,
    setSort
} = createDefaultListActions<ProductColorUPCResponse>('colorUPC/list');


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
            return !selectListLoading(state);
        }
    }
)

export const saveColorUPC = createAsyncThunk<ProductColorUPCResponse|null, ProductColorUPCResponse>(
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

export const selectList = (state: RootState) => state.colorUPC.list.values;
export const selectInactiveCount = (state: RootState) => state.colorUPC.list.values.filter(item => !item.active).length;
export const selectSearch = (state: RootState) => state.colorUPC.list.search;
export const selectShowInactive = (state: RootState) => state.colorUPC.list.showInactive;
export const selectListLoading = (state: RootState) => state.colorUPC.list.loading === QueryStatus.pending;
export const selectCurrentColorUPC = (state: RootState) => state.colorUPC.current.value;
export const selectLoading = (state: RootState) => state.colorUPC.current.loading === QueryStatus.pending;
export const selectSaving = (state: RootState) => state.colorUPC.current.saving === QueryStatus.pending;
export const selectSort = (state: RootState) => state.colorUPC.list.sort;

export const selectPage = (state: RootState) => state.colorUPC.list.page;

export const selectRowsPerPage = (state: RootState) => state.colorUPC.list.rowsPerPage;

export const selectColorUPCList = createSelector(
    [selectList, selectSearch, selectShowInactive, selectSort],
    (list, search, showInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return list
            .filter(upc => showInactive || upc.active)
            .filter(upc => re.test(upc.ItemCode)
                || re.test(upc.ItemCodeDesc || '')
                || re.test(upc.notes || '')
                || re.test(upc.upc || '')
                || re.test(upc.UDF_UPC_BY_COLOR || ''))
            .sort(colorUPCSorter(sort));
    }
)

const listReducer = createReducer(initialColorUPClListState, (builder) => {
    builder
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
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
            state.values = action.payload.sort(colorUPCSorter(defaultColorUPCSort));
        })
        .addCase(loadColorUPCList.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadColorUPC.fulfilled, (state, action) => {
            if (action.payload && action.payload.id) {
                state.values = [
                    ...state.values.filter(row => row.id !== action.meta.arg.id),
                    action.payload
                ].sort(colorUPCSorter(defaultColorUPCSort));
            }
        })
        .addCase(saveColorUPC.fulfilled, (state, action) => {
            if (action.payload) {
                state.values = [
                    ...state.values.filter(row => row.id !== action.meta.arg.id),
                    action.payload
                ].sort(colorUPCSorter(defaultColorUPCSort));
            }
        })

});

const currentReducer = createReducer(initialCurrentColorUPCState, (builder) => {
    builder
        .addCase(loadColorUPC.pending, (state, action) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadColorUPC.fulfilled, (state, action) => {
            state.value = action.payload;
            state.loading = QueryStatus.fulfilled;
        })
        .addCase(loadColorUPC.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveColorUPC.pending, (state, action) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveColorUPC.fulfilled, (state, action) => {
            state.value = action.payload;
            state.saving = QueryStatus.fulfilled;
        })
        .addCase(saveColorUPC.rejected, (state) => {
            state.saving = QueryStatus.rejected;
        })
});

const colorUPCReducer = combineReducers({
    list: listReducer,
    current: currentReducer,
});
export default colorUPCReducer;
