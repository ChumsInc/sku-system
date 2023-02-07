import {combineReducers} from "redux";
import {defaultMixSort, productMixSorter} from "./utils";
import {
    createDefaultListActions,
    CurrentValueState,
    initialCurrentValueState,
    initialListState,
    ListState
} from "../redux-utils";
import {ProductMixInfo} from "chums-types";
import {getPreference, localStorageKeys} from "../../api/preferences";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {emptyMix, fetchMix, fetchMixList, postMix} from "../../api/mixes";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {RootState} from "../../app/configureStore";


export const {
    setSearch,
    setPage,
    setRowsPerPage,
    toggleShowInactive,
    setSort
} = createDefaultListActions<ProductMixInfo>('mixes/list');

export const initialMixListState = (): ListState<ProductMixInfo> => ({
    ...initialListState,
    rowsPerPage: getPreference(localStorageKeys.mixesRowsPerPage, 25),
    sort: {...defaultMixSort},
});

const initialCurrentMixState: CurrentValueState<ProductMixInfo> = {
    ...initialCurrentValueState,
}

export const setNewMix = createAction('mixes/current/new');

export const loadMixes = createAsyncThunk<ProductMixInfo[]>(
    'mixes/list/load',
    async () => {
        return await fetchMixList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadMix = createAsyncThunk<ProductMixInfo | null, number | undefined>(
    'mixes/current/load',
    async (arg) => {
        return await fetchMix(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectLoading(state) || selectMixLoading(state) || selectMixSaving(state));
        }
    }
)

export const saveMix = createAsyncThunk<ProductMixInfo, ProductMixInfo>(
    'mixes/current/save',
    async (arg) => {
        return postMix(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectLoading(state) || selectMixLoading(state) || selectMixSaving(state));
        }
    }
)

export const selectMixList = (state: RootState) => state.mixes.list.values;
export const selectInactiveCount = (state:RootState)  => state.mixes.list.values.filter(item => !item.active).length;


export const selectSearch = (state: RootState) => state.mixes.list.search;

export const selectShowInactive = (state: RootState) => state.mixes.list.showInactive;
export const selectPage = (state: RootState) => state.mixes.list.page;
export const selectRowsPerPage = (state: RootState) => state.mixes.list.rowsPerPage;
export const selectSort = (state: RootState) => state.mixes.list.sort;

export const selectLoading = (state: RootState) => state.mixes.list.loading === QueryStatus.pending;

export const selectCurrentMix = (state: RootState) => state.mixes.current.value;

export const selectMixLoading = (state: RootState) => state.mixes.current.loading === QueryStatus.pending
export const selectMixSaving = (state: RootState) => state.mixes.current.saving === QueryStatus.pending;

export const selectFilteredMixesList = createSelector(
    [selectMixList, selectSearch, selectShowInactive, selectSort],
    (list, search, showInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return list
            .filter(mix => showInactive || mix.active)
            .filter(mix => re.test(mix.code) || re.test(mix.description || '') || re.test(mix.notes || ''))
            .sort(productMixSorter(sort));
    }
)

const listReducer = createReducer(initialMixListState, (builder) => {
    builder
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(loadMixes.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadMixes.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.values = action.payload.sort(productMixSorter(defaultMixSort));
        })
        .addCase(loadMixes.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadMix.fulfilled, (state, action) => {
            if (action.payload && action.payload.id) {
                state.values = [
                    ...state.values.filter(mix => mix.id !== action.payload?.id),
                    action.payload,
                ].sort(productMixSorter(defaultMixSort));
            }
        })
        .addCase(saveMix.fulfilled, (state, action) => {
            if (action.payload) {
                state.values = [
                    ...state.values.filter(mix => mix.id !== action.payload?.id),
                    action.payload,
                ].sort(productMixSorter(defaultMixSort));
            }
        })
});

const currentMixReducer = createReducer(initialCurrentMixState, (builder) => {
    builder
        .addCase(loadMixes.fulfilled, (state, action) => {
            if (state.value?.id) {
                const [current] = action.payload.filter(mix => mix.id === state.value?.id);
                state.value = current;
            }
        })
        .addCase(loadMix.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadMix.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(loadMix.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveMix.pending, (state) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveMix.fulfilled, (state, action) => {
            state.saving = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(saveMix.rejected, (state) => {
            state.saving = QueryStatus.rejected;
        })
        .addCase(setNewMix, (state) => {
            state.value = {...emptyMix}
        })
});

const mixesReducer = combineReducers({
    list: listReducer,
    current: currentMixReducer,
});

export default mixesReducer;
