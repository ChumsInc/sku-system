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
    showInactive: getPreference(localStorageKeys.itemsShowInactive, false),
});

export const {
    setSort,
    setSearch,
    setPage,
    setRowsPerPage,
    toggleShowInactive
} = createDefaultListActions<Product>('items');

export const isActiveItem = (item: Product) => !(item.ProductType === 'D' || item.InactiveItem === 'Y')

export const loadSKUItems = createAsyncThunk<Product[], BaseSKU|null>(
    'items/load',
    async (arg) => {
        return await fetchSKUItems(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state) && !selectAssigningItems(state).length;
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
export const selectShowInactive = (state: RootState) => state.items.showInactive;
export const selectLoading = (state: RootState) => state.items.loading === QueryStatus.pending;

export const selectSort = (state: RootState) => state.items.sort;
export const selectPage = (state:RootState) => state.items.page;
export const selectRowsPerPage = (state:RootState) => state.items.rowsPerPage;


export const selectFilteredItemList = createSelector(
    [selectItemsList, selectSearch, selectShowInactive, selectSort],
    (list, search, showInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }
        return list
            .filter(item => showInactive || isActiveItem(item))
            .filter(item => re.test(item.ItemCode) || re.test(item.UDF_UPC || '') || re.test(item.ItemCodeDesc) || re.test(item.UDF_UPC_BY_COLOR || ''))
            .sort(productSorter(sort));

    }
)


const itemsReducer = createReducer(initialItemsState, (builder) => {
    builder
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
            setPreference(localStorageKeys.itemsShowInactive, state.showInactive);
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



export default itemsReducer;
