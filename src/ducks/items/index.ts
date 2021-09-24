import {combineReducers} from "redux";
import {Product, ProductSKU, ProductSorterProps} from "../../types";
import {skuGroupSelected, skuSelected,} from "../sku/actionTypes";
import {defaultItemSort, productSorter} from "../sku/utils";
import {selectIsAdmin} from "../users";
import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {RootState} from "../index";
import {ThunkAction} from "redux-thunk";

export interface ItemsPayload extends ActionPayload {
    items?: Product[],
    item?: Product,
    search?: string,
    itemCode?: string,
}

export interface ItemsAction extends ActionInterface {
    payload?: ItemsPayload,
}

export interface ItemsThunkAction extends ThunkAction<any, RootState, unknown, ItemsAction> {
}


export const itemsSearchChanged = 'items/searchChanged';
export const itemsFilterInactiveChanged = 'items/filterInactiveChanged';

export const itemsFetchRequested = 'items/fetchRequested';
export const itemsFetchSucceeded = 'items/fetchSucceeded';
export const itemsFetchFailed = 'items/fetchFailed';

export const itemsAssignUPCRequested = 'items/assignUPCRequested';
export const itemsAssignUPCSucceeded = 'items/assignUPCSucceeded';
export const itemsAssignUPCFailed = 'items/assignUPCFailed';


export const itemsFetchItemRequested = 'items/fetchItemRequested';
export const itemsFetchItemSucceeded = 'items/fetchItemSucceeded';
export const itemsFetchItemFailed = 'items/fetchItemFailed';

export const searchChangedAction = (search:string) => ({type: itemsSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: itemsFilterInactiveChanged});

export const loadSKUItemsAction = (sku:ProductSKU):ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: itemsFetchRequested})
            const url = buildPath('/api/operations/sku/:sku', {sku: sku.sku});
            const {list} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: itemsFetchSucceeded, payload: {items: list}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("loadSKUItemsAction()", error.message);
                return dispatch({type:itemsFetchFailed, payload: {error, context: itemsFetchRequested}})
            }
            console.error("loadSKUItemsAction()", error);
        }

}

export const assignNextColorUPCAction = (item: Product): ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            console.log(item);
            const {company, ItemCode, UDF_UPC_BY_COLOR, InactiveItem, ProductType} = item;
            if (InactiveItem === 'Y' || ProductType === 'D' || !!UDF_UPC_BY_COLOR) {
                return;
            }

            const state = getState();
            if (!selectIsAdmin(state)) {
                return;
            }
            if (selectAssigningItem(item.ItemCode)(state)) {
                return;
            }
            dispatch({type: itemsAssignUPCRequested, payload: {itemCode: ItemCode}});
            const {nextUPC} = await fetchJSON('/api/operations/sku/by-color/next', {cache: 'no-cache'});
            await fetchJSON('/api/operations/sku/by-color', {
                method: 'POST',
                body: JSON.stringify({ItemCode, upc: nextUPC})
            });
            await fetchJSON('/sage/api/item-upc.php', {
                method: 'POST',
                body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC, action: 'update'})
            })
            const {item: savedItem} = await fetchJSON('/api/operations/sku/by-color/update-item', {
                method: 'POST',
                body: JSON.stringify({Company: company, ItemCode, UDF_UPC_BY_COLOR: nextUPC})
            });
            dispatch({type: itemsAssignUPCSucceeded, payload: {item: savedItem}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("assignNextColorUPCAction()", error.message);
                return dispatch({type: itemsAssignUPCFailed, payload: {itemCode: item.ItemCode, error, context: itemsAssignUPCRequested}})
            }
            console.error("assignNextColorUPCAction()", error);
        }
    };

export const selectItemList = (sort:ProductSorterProps) => (state: RootState): Product[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch(err) {}
    return state.items.list
        .filter(item => !filterInactive || !(item.ProductType === 'D' || item.InactiveItem === 'Y'))
        .filter(item => re.test(item.ItemCode) || re.test(item.UDF_UPC || '') || re.test(item.ItemCodeDesc) || re.test(item.UDF_UPC_BY_COLOR || ''))
}
export const selectItemsCount = (state:RootState) => state.items.list.length;
export const selectItemsLoading = (state: RootState) => state.items.list;
export const selectAssigningItem = (itemCode: string) => (state: RootState): boolean => state.items.assigningItems.includes(itemCode);
export const selectSearch = (state: RootState) => state.items.search;
export const selectFilterInactive = (state: RootState) => state.items.filterInactive;
export const selectLoading = (state:RootState) => state.items.loading;


const searchReducer = (state: string = '', action: ItemsAction): string => {
    const {type, payload} = action;
    switch (type) {
    case itemsSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: ItemsAction): boolean => {
    switch (action.type) {
    case itemsFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const itemsReducer = (state: Product[] = [], action: ItemsAction) => {
    const {type, payload} = action;
    switch (type) {
    case itemsFetchSucceeded:
        if (payload?.items) {
            return [...payload.items].sort(productSorter(defaultItemSort));
        }
        return state;
    case itemsFetchItemSucceeded:
    case itemsAssignUPCSucceeded:
        if (payload?.item) {
            return [
                ...state.filter(i => i.ItemCode !== payload.item?.ItemCode),
                {...payload.item}
            ].sort(productSorter(defaultItemSort))
        }
        return state;
    case skuGroupSelected:
    case skuSelected:
        return [];
    default:
        return state;
    }
};

const itemsLoadingReducer = (state: boolean = false, action: ItemsAction): boolean => {
    const {type} = action;
    switch (type) {
    case itemsFetchRequested:
        return true;
    case itemsFetchSucceeded:
    case itemsFetchFailed:
        return false;
    default:
        return state;
    }
};

const assigningItemsReducer = (state: string[] = [], action: ItemsAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case itemsAssignUPCRequested:
        if (payload?.itemCode) {
            if (state.includes(payload.itemCode)) {
                return state;
            }
            return [...state, payload.itemCode];
        }
        return state;
    case itemsAssignUPCFailed:
        return state.filter(itemCode => itemCode !== payload?.itemCode);
    case itemsAssignUPCSucceeded:
        return state.filter(itemCode => itemCode !== payload?.item?.ItemCode);
    default:
        return state;
    }
}

export default combineReducers({
    search: searchReducer,
    filterInactive: filterInactiveReducer,
    list: itemsReducer,
    loading: itemsLoadingReducer,
    assigningItems: assigningItemsReducer
});
