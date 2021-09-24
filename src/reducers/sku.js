import {combineReducers} from 'redux';
import {
    FETCH_SKU_ITEMS,
    FETCH_SKU_LIST, FETCH_SKU_LIST_FAILURE,
    RECEIVE_SKU, RECEIVE_SKU_ITEM, RECEIVE_SKU_ITEMS, RECEIVE_SKU_LIST,
    SELECT_SKU, SELECT_SKU_GROUP,
    UPDATE_SKU
} from "../constants";

const list = (state = [], action) => {
    const {type, sku, list} = action;
    switch (type) {
    case RECEIVE_SKU_LIST:
        return [...list];
    case RECEIVE_SKU:
        return [...state.filter(s => s.id !== sku.id), {...sku}];
    default:
        return state;
    }
};

const selected = (state = {id: 0}, action) => {
    const {type, sku, field, value} = action;
    switch (type) {
    case SELECT_SKU:
    case RECEIVE_SKU:
        return {...sku};
    case UPDATE_SKU:
        return {...state, [field]: value, changed: true};
    case SELECT_SKU_GROUP:
        return {
            sku_group_id: action.group.id,
        };
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_SKU_LIST:
        return true;
    case FETCH_SKU_LIST_FAILURE:
    case RECEIVE_SKU_LIST:
        return false;
    default:
        return state;
    }
};

const selectedGroup = (state = {}, action) => {
    const {type, group} = action;
    switch (type) {
    case SELECT_SKU_GROUP:
        return {...group};
    default:
        return state;
    }
};

const items = (state = [], action) => {
    const {type, items, item} = action;
    switch (type) {
    case RECEIVE_SKU_ITEMS:
        return [...items];
    case RECEIVE_SKU_ITEM:
        return [...state.filter(i => i.ItemCode !== item.ItemCode), {...item}]
    case SELECT_SKU_GROUP:
    case SELECT_SKU:
        return [];
    default:
        return state;
    }
};

const itemsLoading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_SKU_ITEMS:
        return true;
    case RECEIVE_SKU_ITEMS:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    selected,
    loading,
    selectedGroup,
    items,
    itemsLoading,
});
