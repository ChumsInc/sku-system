import {combineReducers, EmptyObject} from 'redux';
import {Product, ProductSKU, SKUGroup, ProductSKUList} from "../../types";
import {
    newProductSKU,
    SKUAction,
    skuFetchListFailed, skuFetchListRequested,
    skuFetchListSucceeded, skuFetchSKUFailed,
    skuFetchSKURequested,
    skuFetchSKUSucceeded, skuFilterInactiveChanged,
    skuGroupSelected, skuSaveSKUFailed, skuSaveSKURequested, skuSaveSKUSucceeded, skuSearchChanged,
    skuSelected,
    skuSelectedChanged
} from "./actionTypes";
import {defaultItemSort, productSorter} from "./utils";


const searchReducer = (state: string = '', action:SKUAction):string => {
    const {type, payload} = action;
    switch (type) {
    case skuSearchChanged:
        return payload?.search || '';
    default: return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action:SKUAction):boolean => {
    switch (action.type) {
    case skuFilterInactiveChanged:
        return !state;
    default: return state;
    }
}

const listReducer = (state: ProductSKUList = {}, action: SKUAction):ProductSKUList => {
    const {type, payload} = action;
    switch (type) {
    case skuFetchListSucceeded:
        if (payload?.list) {
            const skuList: ProductSKUList = {};
            payload.list.forEach(sku => {
                skuList[sku.id] = sku;
            });
            return skuList;
        }
        return state;
    case skuSaveSKUSucceeded:
    case skuFetchSKUSucceeded:
        if (payload?.sku) {
            return {
                ...state,
                [payload.sku.id]: payload.sku,
            }
        }
        return state;
    default:
        return state;
    }
};

const selectedReducer = (state = newProductSKU, action: SKUAction): ProductSKU => {
    const {type, payload} = action;
    switch (type) {
    case skuFetchSKURequested:
    case skuSelected:
    case skuFetchSKUSucceeded:
    case skuSaveSKUSucceeded:
        if (payload?.sku) {
            return {...payload.sku};
        }
        return state;
    case skuSelectedChanged:
        if (payload?.field) {
            return {...state, [payload.field]: payload.value}
        }
        return state;
    case skuGroupSelected:
        if (payload?.group) {
            return {...newProductSKU, sku_group_id: payload.group.id}
        }
        return state;
    default:
        return state;
    }
};

const selectedLoadingReducer = (state: boolean = false, action: SKUAction): boolean => {
    const {type} = action;
    switch (type) {
    case skuFetchSKURequested:
        return true;
    case skuFetchSKUSucceeded:
    case skuFetchSKUFailed:
        return false;
    default:
        return state;
    }
};

const loadingReducer = (state: boolean = false, action: SKUAction): boolean => {
    const {type} = action;
    switch (type) {
    case skuFetchListRequested:
        return true;
    case skuFetchListSucceeded:
    case skuFetchListFailed:
        return false;
    default:
        return state;
    }
};



const savingReducer = (state: boolean = false, action: SKUAction): boolean => {
    const {type} = action;
    switch (type) {
    case skuSaveSKURequested:
        return true;
    case skuSaveSKUSucceeded:
    case skuSaveSKUFailed:
        return false;
    default:
        return state;
    }
};

const selectedGroupReducer = (state: SKUGroup | null = null, action: SKUAction): SKUGroup | null => {
    const {type, payload} = action;
    switch (type) {
    case skuGroupSelected:
        if (payload?.group) {
            return {...payload.group};
        }
        return null;
    default:
        return state;
    }
};



export default combineReducers({
    search: searchReducer,
    filterInactive: filterInactiveReducer,
    list: listReducer,
    selected: selectedReducer,
    selectedLoading: selectedLoadingReducer,
    loading: loadingReducer,
    saving: savingReducer,
    selectedGroup: selectedGroupReducer,
});
