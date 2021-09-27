import {RootState} from "../index";
import {Product, ProductSKU, SKUGroup, ProductSKUSorterProps} from "../../types";
import {EmptyObject} from "redux";
import {productSKUSorter} from "./utils";


export const selectSKUList = (sort:ProductSKUSorterProps) => (state:RootState):ProductSKU[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);
    const skuGroup = selectSelectedGroup(state);

    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch(err) {}
    return Object.values(state.sku.list)
        .filter(item => !skuGroup || item.sku_group_id === skuGroup.id)
        .filter(item => !filterInactive || item.active)
        .filter(item => re.test(item.sku) || re.test(item.upc) || re.test(item.description) || re.test(item.notes || ''))
        .sort(productSKUSorter(sort));
}
export const selectSKUListLength = (state:RootState) => Object.values(state.sku.list).length;
export const selectSKUListActiveLength = (state:RootState) => Object.values(state.sku.list).filter(sku => sku.active).length;
export const selectSKUListLoading = (state:RootState):boolean => state.sku.loading;
export const selectSKUSaving = (state:RootState):boolean => state.sku.saving;
export const selectSelectedSKU = (state:RootState):ProductSKU => state.sku.selected;
export const selectSelectedSKULoading = (state:RootState):boolean => state.sku.selectedLoading;
export const selectSelectedGroup = (state:RootState):SKUGroup|null => state.sku.selectedGroup || null;
export const selectSearch = (state:RootState) => state.sku.search;
export const selectFilterInactive = (state:RootState) => state.sku.filterInactive;
