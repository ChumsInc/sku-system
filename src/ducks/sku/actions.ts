import {ProductSKU, ProductSKUField, SKUGroup} from "../../types";
import {
    newProductSKU,
    SKUAction,
    skuFetchListFailed,
    skuFetchListRequested,
    skuFetchListSucceeded,
    skuFetchSKUFailed,
    skuFetchSKURequested,
    skuFetchSKUSucceeded,
    skuFilterInactiveChanged,
    skuGroupSelected,
    skuSaveSKUFailed,
    skuSaveSKURequested,
    skuSaveSKUSucceeded,
    skuSearchChanged, skuSelected,
    skuSelectedChanged,
    SKUThunkAction
} from "./actionTypes";
import {buildPath, fetchJSON} from "chums-ducks";
import {selectSKUListLoading, selectSKUSaving} from "./selectors";
import {selectIsAdmin} from "../users";

export const searchChangedAction = (search: string): SKUAction => ({type: skuSearchChanged, payload: {search}});
export const filterInactiveChangedAction = (): SKUAction => ({type: skuFilterInactiveChanged});

export const selectSKUAction = (sku: ProductSKU = newProductSKU): SKUThunkAction =>
    async (dispatch, getState) => {
        try {
            if (!sku || !sku.id) {
                dispatch({type: skuSelected, payload: {sku}})
                return;
            }
            const state = getState();
            if (selectSKUListLoading(state)) {
                return;
            }
            dispatch({type: skuFetchSKURequested, payload: {sku}});
            const url = buildPath('/api/operations/sku/base/:id', {id: sku.id});
            const result = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: skuFetchSKUSucceeded, payload: {sku: result.sku}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("selectSKUAction()", error.message);
                return dispatch({type: skuFetchSKUFailed, payload: {error, context: skuFetchSKURequested}})
            }
            console.error("selectSKUAction()", error);
        }
    };

export const fetchSKUListAction = (group_id?: number): SKUThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectSKUListLoading(state)) {
                return;
            }
            dispatch({type: skuFetchListRequested});
            const url = buildPath('/api/operations/sku/base/group/:id?', {id: group_id});
            const {list} = await fetchJSON(url, {cache: "no-cache"});
            dispatch({type: skuFetchListSucceeded, payload: {list}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchSKUListAction()", error.message);
                return dispatch({type: skuFetchListFailed, payload: {error, context: skuFetchListRequested}})
            }
            console.error("fetchSKUListAction()", error);
        }
    };


export const changeSKUAction = ({field, value}: { field: ProductSKUField, value: unknown }): SKUAction =>
    ({type: skuSelectedChanged, payload: {field, value}});

export const saveSKUAction = (sku: ProductSKU): SKUThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (!selectIsAdmin(state)) {
                return;
            }
            if (selectSKUListLoading(state) || selectSKUSaving(state)) {
                return;
            }
            dispatch({type: skuSaveSKURequested});
            const response = await fetchJSON('/api/operations/sku/base', {method: 'post', body: JSON.stringify(sku)});
            const {skuBase} = response;
            dispatch({type: skuSaveSKUSucceeded, payload: {sku: skuBase}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveSKUAction()", error.message);
                return dispatch({type: skuSaveSKUFailed, payload: {error, context: skuSaveSKURequested}})
            }
            console.error("saveSKUAction()", error);
        }
    };

export const selectSKUGroupAction = (group?: SKUGroup): SKUThunkAction =>
    (dispatch, getState) => {
        dispatch({type: skuGroupSelected, payload: {group}});
        dispatch(fetchSKUListAction(group?.id));
    };


