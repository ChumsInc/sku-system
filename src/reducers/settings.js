import {combineReducers} from "redux";
import {
    FETCH_CATEGORIES, FETCH_COLORS,
    FETCH_LINES, FETCH_SETTINGS, FETCH_SKU_LIST,
    FETCH_SUBCATEGORIES,
    RECEIVE_CATEGORIES, RECEIVE_COLORS,
    RECEIVE_LINES, RECEIVE_SETTINGS, RECEIVE_SKU_LIST,
    RECEIVE_SUBCATEGORIES
} from "../constants";

const lines = (state = [], action) => {
    const {type, lines} = action;
    switch (type) {
    case FETCH_SETTINGS:
        return [];
    case RECEIVE_SETTINGS:
        return [...lines];
    default:
        return state;
    }
};

const subCategories = (state = [], action) => {
    const {type, subCategories} = action;
    switch (type) {
    case FETCH_SETTINGS:
        return [];
    case RECEIVE_SETTINGS:
        return [...subCategories];
    default:
        return state;
    }
};

const skuList = (state = [], action) => {
    const {type, skuList} = action;
    switch (type) {
    case FETCH_SETTINGS:
        return [];
    case RECEIVE_SETTINGS:
        return [...skuList];
    default:
        return state;
    }
};

const colors = (state = [], action) => {
    const {type, colors} = action;
    switch (type) {
    case FETCH_SETTINGS:
        return [];
    case RECEIVE_SETTINGS:
        return [...colors];
    default:
        return state;
    }
};

const mixes = (state = [], action) => {
    const {type, mixes} = action;
    switch (type) {
    case FETCH_SETTINGS:
        return [];
    case RECEIVE_SETTINGS:
        return [...mixes];
    default:
        return state;
    }
};

export default combineReducers({
    lines,
    subCategories,
    skuList,
    colors,
    mixes,
});
