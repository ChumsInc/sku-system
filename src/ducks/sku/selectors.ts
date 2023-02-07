import {productSKUSorter} from "./utils";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {QueryStatus} from "@reduxjs/toolkit/query";

export const selectSKUList = (state:RootState) => state.sku.list.values;
export const selectSearch = (state: RootState) => state.sku.list.search;
export const selectShowInactive = (state: RootState) => state.sku.list.showInactive;
export const selectSKUGroupFilter = (state: RootState) => state.sku.list.skuGroup;
export const selectSort = (state:RootState) => state.sku.list.sort;
export const selectPage = (state:RootState) => state.sku.list.page;
export const selectRowsPerPage = (state:RootState) => state.sku.list.rowsPerPage;
export const selectListLoaded = (state:RootState) => state.sku.list.loaded;

export const selectFilteredSKUList = createSelector(
    [selectSKUList, selectSearch, selectShowInactive, selectSKUGroupFilter, selectSort],
    (list, search, showInactive, group, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return Object.values(list)
            .filter(item => !group || item.sku_group_id === group.id)
            .filter(item => showInactive || item.active)
            .filter(item => re.test(item.sku ?? '')
                || re.test(item.upc ?? '')
                || re.test(item.description ?? '')
                || re.test(item.notes ?? ''))
            .sort(productSKUSorter(sort));
    }
)

export const selectSKUListLength = (state: RootState) => state.sku.list.values.length;
export const selectInactiveCount = (state: RootState) => state.sku.list.values.filter(sku => !sku.active).length;
export const selectListLoading = (state: RootState): boolean => state.sku.list.loading === QueryStatus.pending;
export const selectSaving = (state: RootState): boolean => state.sku.current.saving === QueryStatus.pending;
export const selectCurrentSKU = (state: RootState) => state.sku.current.value;
export const selectLoading = (state: RootState): boolean => state.sku.current.loading === QueryStatus.pending;
