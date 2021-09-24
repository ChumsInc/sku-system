import {combineReducers} from 'redux';
import {
    FETCH_CATEGORIES,
    RECEIVE_CATEGORIES,
    RECEIVE_CATEGORY,
    RECEIVE_SETTINGS,
    SELECT_CATEGORY,
    UPDATE_CATEGORY
} from "../constants";

const list = (state = [], action) => {
    const {type, categories, category} = action;
    switch (type) {
    case RECEIVE_CATEGORIES:
        return [...categories];
    case RECEIVE_CATEGORY:
        return [...state.filter(c => c.id !== category.id), {...category}];
    default:
        return state;
    }
};

const selected = (state = {}, action) => {
    const {type, category, field, value} = action;
    switch (type) {
    case SELECT_CATEGORY:
    case RECEIVE_CATEGORY:
        return {...category};
    case UPDATE_CATEGORY:
        return {...state, [field]: value, changed: true};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_CATEGORIES:
        return true;
    case RECEIVE_CATEGORIES:
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
