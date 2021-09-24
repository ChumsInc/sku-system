import {Product, ProductSKU, ProductSKUField, ProductSorterProps, SKUGroup} from "../../types";
import {ActionInterface, ActionPayload} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export const skuSearchChanged = 'sku/searchChanged';
export const skuFilterInactiveChanged = 'sku/filterInactiveChanged';

export const skuFetchListRequested = 'sku/fetchListRequested';
export const skuFetchListSucceeded = 'sku/fetchListSucceeded';
export const skuFetchListFailed = 'sku/fetchListFailed';

export const skuFetchSKURequested = 'sku/fetchSKURequested';
export const skuFetchSKUSucceeded = 'sku/fetchSKUSucceeded';
export const skuFetchSKUFailed = 'sku/fetchSKUFailed';

export const skuSaveSKURequested = 'sku/saveSKURequested';
export const skuSaveSKUSucceeded = 'sku/saveSKUSucceeded';
export const skuSaveSKUFailed = 'sku/saveSKUFailed';


export const skuSelected = 'sku/SKUSelected';
export const skuGroupSelected = 'sku/SKUGroupSelected';

export const skuSelectedChanged = 'sku/selectedChanged';

export interface SKUPayload extends ActionPayload {
    list?: ProductSKU[],
    sku?: ProductSKU,
    field?: ProductSKUField,
    value?: unknown,
    group?: SKUGroup,
    items?: Product[],
    item?: Product,
    itemCode?: string,
    search?: string,
}

export interface SKUAction extends ActionInterface {
    payload?: SKUPayload,
}

export interface SKUThunkAction extends ThunkAction<any, RootState, unknown, SKUAction> {}

export const newProductSKU:ProductSKU = {
    id: 0,
    sku: '',
    active: true,
    description: '',
    notes: null,
    // tags: {},
    sku_group_id: 0,
    upc: '',
    Category4: '',
}
