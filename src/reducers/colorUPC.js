import {combineReducers} from 'redux';
import {
    FETCH_COLOR_UPC_LIST, FETCH_COLOR_UPC_LIST_FAILURE,
    RECEIVE_COLOR_UPC, RECEIVE_COLOR_UPC_LIST, RECEIVE_SKU_ITEM,
    SELECT_COLOR_UPC,
    UPDATE_COLOR_UPC
} from "../constants";

const list = (state = [], action) => {
    const {type, upc, list, item} = action;
    switch (type) {
    case RECEIVE_COLOR_UPC_LIST:
        return [...list];
    case RECEIVE_COLOR_UPC:
        return [
            ...state.filter(u => u.id !== upc.id),
            {...upc}
        ];
    case RECEIVE_SKU_ITEM:
        return [...state.filter(u => u.id !== item.id), {...item}];
    default:
        return state;
    }
};

const selected = (state = {id: 0}, action) => {
    const {type, upc, field, value} = action;
    switch (type) {
    case SELECT_COLOR_UPC:
    case RECEIVE_COLOR_UPC:
        return {...upc};
    case UPDATE_COLOR_UPC:
        return {...state, [field]: value, changed: true};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_COLOR_UPC_LIST:
        return true;
    case FETCH_COLOR_UPC_LIST_FAILURE:
    case RECEIVE_COLOR_UPC_LIST:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    selected,
    loading,
});
