import {selectCurrentSKULoading, selectSKUGroupFilter, selectSKUListLoading, selectSKUSaving} from "./selectors";
import {selectIsAdmin} from "../users";
import {createDefaultListActions} from "../redux-utils";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {BaseSKU, SKUGroup} from "chums-types";
import {fetchSKU, fetchSKUList, postSKU} from "../../api/sku";
import {RootState} from "../../app/configureStore";

export const {
    setSearch,
    setPage,
    setRowsPerPage,
    toggleFilterInactive,
    setSort
} = createDefaultListActions<BaseSKU>('sku/list')

export const setSKUGroupFilter = createAction<SKUGroup | undefined>('sku/list/setSKUGroupFilter');

export const loadSKU = createAsyncThunk<BaseSKU | null, BaseSKU>(
    'sku/current/load',
    async (arg) => {
        return await fetchSKU(arg.id ?? 0);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSKUSaving(state) && !selectCurrentSKULoading(state);
        }
    }
)

export const loadSKUList = createAsyncThunk<BaseSKU[]>(
    'sku/list/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const group = selectSKUGroupFilter(state);
        return fetchSKUList(group?.id ?? null);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSKUListLoading(state);
        }
    }
)

export const saveSKU = createAsyncThunk<BaseSKU, BaseSKU>(
    'sku/current/save',
    async (arg) => {
        return await postSKU(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectSKUSaving(state) && !selectCurrentSKULoading(state);
        }
    }
)
