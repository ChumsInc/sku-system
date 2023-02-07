import {combineReducers} from 'redux';
import {defaultSort, productSKUSorter} from "./utils";
import {CurrentValueState, initialCurrentValueState, initialListState, ListState} from "../redux-utils";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadSKU,
    loadSKUList,
    saveSKU,
    setPage,
    setRowsPerPage,
    setSearch,
    setSKUGroupFilter,
    setSort,
    toggleShowInactive
} from "./actions";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {BaseSKU, SKUGroup} from "chums-types";
import {QueryStatus} from "@reduxjs/toolkit/query";


export interface SKUListState extends ListState<BaseSKU> {
    skuGroup: SKUGroup | null,
}

const initialSKUListState = (): SKUListState => ({
    ...initialListState,
    values: [],
    sort: {...defaultSort},
    rowsPerPage: getPreference(localStorageKeys.skuListRowsPerPage, 25),
    showInactive: getPreference(localStorageKeys.skuListShowInactive, false),
    skuGroup: null,
})

const initialCurrentSKUState: CurrentValueState<BaseSKU> = {
    ...initialCurrentValueState,
}

const skuListReducer = createReducer(initialSKUListState, (builder) => {
    builder
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            setPreference(localStorageKeys.skuListShowInactive, state.showInactive);
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            setPreference<number>(localStorageKeys.skuListRowsPerPage, action.payload);
            state.rowsPerPage = action.payload;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(loadSKUList.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadSKUList.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.values = action.payload.sort(productSKUSorter(defaultSort));
        })
        .addCase(loadSKUList.rejected, (state, action) => {
            state.loading = QueryStatus.rejected
        })
        .addCase(setSKUGroupFilter, (state, action) => {
            state.skuGroup = action.payload ?? null;
        })
        .addCase(loadSKU.fulfilled, (state, action) => {
            if (action.payload) {
                state.values = [
                    ...state.values.filter(row => row.id !== action.payload?.id),
                    action.payload,
                ]
            }
        })
        .addCase(saveSKU.fulfilled, (state, action) => {
            state.values = [
                ...state.values.filter(row => row.id !== action.payload.id),
                action.payload,
            ];
        })
});

const currentSKUReducer = createReducer(initialCurrentSKUState, (builder) => {
    builder
        .addCase(loadSKUList.fulfilled, (state, action) => {
            if (state.value) {
                const [value] = action.payload.filter(row => row?.id === state.value?.id)
                if (value) {
                    state.value = value;
                }
            }
        })
        .addCase(loadSKU.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadSKU.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(loadSKU.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveSKU.pending, (state) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveSKU.fulfilled, (state, action) => {
            state.saving = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(saveSKU.rejected, (state) => {
            state.saving = QueryStatus.rejected;
        })
});

const skuReducer = combineReducers({
    list: skuListReducer,
    current: currentSKUReducer,
});

export default skuReducer;
