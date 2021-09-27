import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {Category, CategoryField, CategorySorterProps} from "../../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {selectIsAdmin} from "../users";
import {combineReducers} from "redux";
import {fetchSettingsSucceeded, settingsFetchRequested} from "../settings";
import {categorySorter, defaultCategorySort} from "./utils";

export interface CategoryPayload extends ActionPayload {
    category?: Category,
    categories?: Category[],
    search?: string,
    field?: CategoryField,
    value?: unknown
}

export interface CategoryAction extends ActionInterface {
    payload?: CategoryPayload,
}

export interface CategoryThunkAction extends ThunkAction<any, RootState, unknown, CategoryAction> {
}


export const defaultCategory: Category = {
    id: 0,
    code: '',
    description: '',
    notes: '',
    tags: {},
    active: true,
    productLine: '',
    Category2: ''
}

const categoriesSearchChanged = 'categories/searchChanged';
const categoriesFilterInactiveChanged = 'categories/filterInactiveChanged';

const fetchListRequested = 'categories/fetchRequested';
const fetchListSucceeded = 'categories/fetchSucceeded';
const fetchListFailed = 'categories/fetchFailed';

const categorySelected = 'categories/selected';
const categoryChanged = 'categories/selected/groupChanged';

const fetchCategoryRequested = 'categories/selected/fetchRequested';
const fetchCategorySucceeded = 'categories/selected/fetchSucceeded';
const fetchCategoryFailed = 'categories/selected/fetchFailed';


const saveCategoryRequested = 'categories/selected/saveRequested';
const saveCategorySucceeded = 'categories/selected/saveSucceeded';
const saveCategoryFailed = 'categories/selected/saveFailed';

export const searchChangedAction = (search: string): CategoryAction => ({
    type: categoriesSearchChanged,
    payload: {search}
});
export const filterInactiveChangedAction = (): CategoryAction => ({type: categoriesFilterInactiveChanged});
export const categoryChangedAction = (field: CategoryField, value: unknown): CategoryAction =>
    ({type: categoryChanged, payload: {field, value}});

export const fetchCategoryAction = (category: Category): CategoryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            if (!category.id) {
                return dispatch({type: categorySelected, payload: {category}});
            }
            dispatch({type: fetchCategoryRequested});
            const url = buildPath('/api/operations/sku/categories/:id', {id: category.id});
            const {list = []} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: fetchCategorySucceeded, payload: {category: list[0] || defaultCategory}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchCategoriesAction()", error.message);
                return dispatch({type: fetchListFailed, payload: {error, context: fetchCategoryRequested}})
            }
            console.error("fetchCategoriesAction()", error);
        }
    };

export const fetchListAction = (): CategoryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: fetchListRequested});
            const {list = []} = await fetchJSON('/api/operations/sku/categories', {cache: 'no-cache'});
            dispatch({type: fetchListSucceeded, payload: {categories: list}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchListAction()", error.message);
                return dispatch({type: fetchListFailed, payload: {error, context: fetchListRequested}})
            }
            console.error("fetchListAction()", error);
        }
    };

export const saveCategoryAction = (category: Category): CategoryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (!selectIsAdmin(state) || selectLoading(state) || selectSaving(state)) {
                return;
            }
            dispatch({type: saveCategoryRequested});
            const response = await fetchJSON('/api/operations/sku/categories', {
                method: 'POST',
                body: JSON.stringify(category)
            });
            dispatch({type: saveCategorySucceeded, payload: {category: response.category}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveGroupAction()", error.message);
                return dispatch({type: saveCategoryFailed, payload: {error, context: saveCategoryRequested}})
            }
            console.error("saveGroupAction()", error);
        }
    };


export const selectSearch = (state: RootState) => state.categories.search;
export const selectFilterInactive = (state: RootState) => state.categories.filterInactive;
export const selectList = (state: RootState): Category[] => state.categories.list.sort(categorySorter(defaultCategorySort));
export const selectSortedList = (sort: CategorySorterProps) => (state: RootState): Category[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);

    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }

    return state.categories.list
        .filter(category => !filterInactive || category.active)
        .filter(category => re.test(category.code) || re.test(category.description) || re.test(category.notes || ''))
        .sort(categorySorter(sort));
}
export const selectCategoriesCount = (state: RootState) => state.categories.list.length;
export const selectActiveCategoriesCount = (state: RootState) => state.categories.list.filter(g => g.active).length;
export const selectCategory = (state: RootState): Category => state.categories.selected || {...defaultCategory};
export const selectLoading = (state: RootState) => state.categories.loading;
export const selectSaving = (state: RootState) => state.categories.saving;

const searchReducer = (state: string = '', action: CategoryAction): string => {
    const {type, payload} = action;
    switch (type) {
    case categoriesSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: CategoryAction): boolean => {
    switch (action.type) {
    case categoriesFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: Category[] = [], action: CategoryAction): Category[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
    case fetchListSucceeded:
        if (payload?.categories) {
            return payload.categories.sort(categorySorter(defaultCategorySort));
        }
        return [];
    case fetchCategorySucceeded:
    case saveCategorySucceeded:
        if (payload?.category) {
            return [
                ...state.filter(group => group.id !== payload.category?.id),
                {...payload.category}
            ].sort(categorySorter(defaultCategorySort));
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state: Category = defaultCategory, action: CategoryAction): Category => {
    const {type, payload} = action;
    switch (type) {
    case fetchCategorySucceeded:
    case saveCategorySucceeded:
    case categorySelected:
        if (payload?.category) {
            return {...payload.category};
        }
        return {...defaultCategory};
    case fetchListSucceeded:
        if (state && payload?.categories) {
            const [category] = payload.categories.filter(g => g.id === state.id);
            return {...category};
        }
        return state;

    case categoryChanged:
        if (state && payload?.field) {
            return {...state, [payload.field]: payload.value, changed: true}
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: CategoryAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchListRequested:
        return true;
    case fetchListSucceeded:
    case fetchListFailed:
        return false;
    default:
        return state;
    }
};

const selectedLoadingReducer = (state: boolean = false, action: CategoryAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchCategoryRequested:
        return true;
    case fetchCategorySucceeded:
    case fetchCategoryFailed:
        return false;
    default:
        return state;
    }
};

const savingReducer = (state: boolean = false, action: CategoryAction): boolean => {
    const {type} = action;
    switch (type) {
    case saveCategoryRequested:
        return true;
    case saveCategorySucceeded:
    case saveCategoryFailed:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    search: searchReducer,
    filterInactive: filterInactiveReducer,
    list: listReducer,
    loading: loadingReducer,
    saving: savingReducer,
    selected: selectedReducer,
    selectedLoading: selectedLoadingReducer,
})
