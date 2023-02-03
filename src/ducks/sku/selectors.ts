import {productSKUSorter} from "./utils";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {QueryStatus} from "@reduxjs/toolkit/query";

export const selectSKUList = (state:RootState) => state.sku.list.values;
export const selectSearch = (state: RootState) => state.sku.list.search;
export const selectFilterInactive = (state: RootState) => state.sku.list.filterInactive;
export const selectSKUGroupFilter = (state: RootState) => state.sku.list.skuGroup;
export const selectSort = (state:RootState) => state.sku.list.sort;
export const selectPage = (state:RootState) => state.sku.list.page;
export const selectRowsPerPage = (state:RootState) => state.sku.list.rowsPerPage;
export const selectListLoaded = (state:RootState) => state.sku.list.loaded;

export const selectFilteredSKUList = createSelector(
    [selectSKUList, selectSearch, selectFilterInactive, selectSKUGroupFilter, selectSort],
    (list, search, filterInactive, group, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return Object.values(list)
            .filter(item => !group || item.sku_group_id === group.id)
            .filter(item => !filterInactive || item.active)
            .filter(item => re.test(item.sku ?? '')
                || re.test(item.upc ?? '')
                || re.test(item.description ?? '')
                || re.test(item.notes ?? ''))
            .sort(productSKUSorter(sort));
    }
)

export const selectSKUListLength = (state: RootState) => Object.keys(state.sku.list).length;
export const selectSKUListActiveLength = (state: RootState) => Object.values(state.sku.list).filter(sku => sku.active).length;
export const selectSKUListLoading = (state: RootState): boolean => state.sku.list.loading === QueryStatus.pending;
export const selectSKUSaving = (state: RootState): boolean => state.sku.current.saving === QueryStatus.pending;
export const selectCurrentSKU = (state: RootState) => state.sku.current.value;
export const selectCurrentSKULoading = (state: RootState): boolean => state.sku.current.loading === QueryStatus.pending;
