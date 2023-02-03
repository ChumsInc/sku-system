import {Product} from "../../types";
import {productSorter} from "../sku/utils";
import {selectIsAdmin} from "../users";
import {SortProps} from "chums-components";
import {BaseSKU} from "chums-types";
import {createDefaultListActions, initialListState, ListState} from "../redux-utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {fetchSKUItems, postAssignNextColorUPC} from "../../api/items";
import {RootState} from "../../app/configureStore";


export const defaultSort: SortProps<Product> = {
    field: 'ItemCode',
    ascending: true,
}

export interface ItemsState extends ListState<Product> {
    assigningUPC: string[];
}

export const initialItemsState = (): ItemsState => ({
    ...initialListState,
    rowsPerPage: getPreference<number>(localStorageKeys.itemsRowsPerPage, 25),
    sort: {...defaultSort},
    assigningUPC: [],
});

export const {
    setSort,
    setSearch,
    setPage,
    setRowsPerPage,
    toggleFilterInactive
} = createDefaultListActions<Product>('items');

const itemsReducer = createReducer(initialItemsState, (builder) => {
    builder
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
            setPreference<number>(localStorageKeys.itemsRowsPerPage, action.payload);
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(loadSKUItems.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadSKUItems.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.values = action.payload.sort(productSorter(defaultSort));
        })
        .addCase(loadSKUItems.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(assignNextColorUPCAction.pending, (state, action) => {
            if (!state.assigningUPC.includes(action.meta.arg.ItemCode)) {
                state.assigningUPC = [...state.assigningUPC, action.meta.arg.ItemCode];
            }
        })
        .addCase(assignNextColorUPCAction.fulfilled, (state, action) => {
            state.assigningUPC = state.assigningUPC.filter(item => item !== action.meta.arg.ItemCode);
            state.values = [
                ...state.values.filter(item => item.ItemCode !== action.payload.ItemCode),
                action.payload,
            ].sort(productSorter(defaultSort));
        })
        .addCase(assignNextColorUPCAction.rejected, (state, action) => {
            state.assigningUPC = state.assigningUPC.filter(item => item !== action.meta.arg.ItemCode);
        })

});


export const isActiveItem = (item: Product) => !(item.ProductType === 'D' || item.InactiveItem === 'Y')

export const loadSKUItems = createAsyncThunk<Product[], BaseSKU|null>(
    'items/load',
    async (arg) => {
        return await fetchSKUItems(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg?.Category4 && !selectLoading(state) && !selectAssigningItems(state).length;
        }
    }
)


export const assignNextColorUPCAction = createAsyncThunk<Product, Product>(
    'items/assignColorUPC',
    async (arg) => {
        return postAssignNextColorUPC(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            if (!selectIsAdmin(state)) {
                return false;
            }
            if (!isActiveItem(arg) || !!arg.UDF_UPC_BY_COLOR) {
                return false;
            }
            return !selectAssigningItem(state, arg.ItemCode);
        }
    }
)

export const selectItemsList = (state: RootState) => state.items.values;

export const selectItemsCount = (state: RootState) => state.items.values.length;
export const selectActiveItemsCount = (state: RootState) => state.items.values.filter(item => isActiveItem(item)).length;

export const selectAssigningItem = (state: RootState, itemCode: string): boolean => state.items.assigningUPC.includes(itemCode);
export const selectAssigningItems = (state: RootState) => state.items.assigningUPC;
export const selectSearch = (state: RootState) => state.items.search;
export const selectFilterInactive = (state: RootState) => state.items.filterInactive;
export const selectLoading = (state: RootState) => state.items.loading === QueryStatus.pending;

export const selectSort = (state: RootState) => state.items.sort;
export const selectPage = (state:RootState) => state.items.page;
export const selectRowsPerPage = (state:RootState) => state.items.rowsPerPage;


export const selectFilteredItemList = createSelector(
    [selectItemsList, selectSearch, selectFilterInactive, selectSort],
    (list, search, filterInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return list
            .filter(item => !filterInactive || isActiveItem(item))
            .filter(item => re.test(item.ItemCode) || re.test(item.UDF_UPC || '') || re.test(item.ItemCodeDesc) || re.test(item.UDF_UPC_BY_COLOR || ''))
            .sort(productSorter(sort));

    }
)

export default itemsReducer;
