import {
    RECEIVE_CATEGORY,
    RECEIVE_CATEGORIES,
    SELECT_CATEGORY,
    UPDATE_CATEGORY, DEFAULTS, FETCH_CATEGORIES
} from "../constants";
import {fetchGET, fetchPOST} from "../chums-components/fetch";
import {setAlert} from "./app";


export const selectCategory = (category) => ({type: SELECT_CATEGORY, category});

export const fetchCategories = () => (dispatch, getState) => {
    const state = getState();
    const company = state.app.company || DEFAULTS.company;
    dispatch({type: FETCH_CATEGORIES});
    const url = '/node-dev/sku/categories';

    fetchGET(url)
        .then(res => {
            const categories = res.result
                .map(c => ({
                    ...c,
                    key: c.id,
                    notes: c.notes || ''
                }));
            dispatch({type: RECEIVE_CATEGORIES, categories});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error loading categories: ${err.message}`}));
        });
};

export const updateCategory = (field, value) => ({type: UPDATE_CATEGORY, field, value});

export const saveCategory = (category) => (dispatch, getState) => {
    const state = getState();
    if (!state.app.isAdmin) {
        return;
    }
    const url = '/node-dev/sku/categories';
    fetchPOST(url, category)
        .then(res => {
            const [category] = res.result;
            category.key = category.id;
            category.notes = category.notes || '';
            dispatch({type: RECEIVE_CATEGORY, category});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error saving group: ${err.message}`}))
        });

};
