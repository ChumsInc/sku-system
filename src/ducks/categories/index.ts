import {RootState} from '../../app/configureStore'
import {categorySorter} from "./utils";
import {combineReducers, createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {defaultCategory, fetchCategory, fetchCategoryList, postCategory} from "../../api/categories";
import {ProductCategory} from "chums-types";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {selectIsAdmin} from "../users";
import {
    createDefaultListActions,
    CurrentValueState,
    initialCurrentValueState,
    initialListState,
    ListState
} from "../redux-utils";

const defaultSort: SortProps<ProductCategory> = {
    field: 'code',
    ascending: true,
}

const initialCategoriesListState = (): ListState<ProductCategory> => ({
    ...initialListState,
    sort: defaultSort,
    showInactive: getPreference(localStorageKeys.categoriesShowInactive, false),
})

const initialCurrentCategoryState: CurrentValueState<ProductCategory> = {
    ...initialCurrentValueState,
}

export const {
    setSort,
    setSearch,
    setPage,
    setRowsPerPage,
    toggleShowInactive
} = createDefaultListActions<ProductCategory>('categories/list');


export const setNewCategory = createAction('categories/current/new');


export const loadCategoryList = createAsyncThunk<ProductCategory[]>(
    'categories/list/load',
    async () => {
        return await fetchCategoryList();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectListLoading(state) && !selectSaving(state);
        }
    }
)

export const loadCategory = createAsyncThunk<ProductCategory | null, ProductCategory>(
    'categories/current/load',
    async (arg) => {
        return await fetchCategory(arg.id ?? arg.code);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            console.log(state, selectListLoading(state), selectLoading(state));
            return !selectListLoading(state) && !selectLoading(state);
        }
    }
)

export const saveCategory = createAsyncThunk<ProductCategory, ProductCategory>(
    'categories/current/save',
    async (arg) => {
        return await postCategory(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectSaving(state);
        }
    }
)


export const selectSearch = (state: RootState) => state.categories.list.search;

export const selectShowInactive = (state: RootState) => state.categories.list.showInactive;

export const selectList = (state: RootState) => state.categories.list.values;

export const selectSort = (state: RootState) => state.categories.list.sort;

export const selectCategoryList = createSelector(
    [selectList, selectSort, selectShowInactive, selectSearch],
    (list, sort, showInactive, search) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(cat => showInactive || cat.active)
            .filter(cat => re.test(cat.code) || re.test(cat.description ?? '') || re.test(cat.notes ?? ''))
            .sort(categorySorter(sort));
    }
)


export const selectInactiveCount = (state: RootState) => state.categories.list.values.filter(g => !g.active).length;

export const selectCurrentCategory = (state: RootState): ProductCategory | null => state.categories.current.value;

export const selectListLoading = (state: RootState) => state.categories.list.loading === QueryStatus.pending;

export const selectLoading = (state: RootState) => state.categories.current.loading === QueryStatus.pending;

export const selectSaving = (state: RootState) => state.categories.current.saving === QueryStatus.pending;

export const selectPage = (state: RootState) => state.categories.list.page;

export const selectRowsPerPage = (state: RootState) => state.categories.list.rowsPerPage;


const listReducer = createReducer(initialCategoriesListState, (builder) => {
    builder
        .addCase(loadCategoryList.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadCategoryList.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.values = action.payload.sort(categorySorter(defaultSort));
        })
        .addCase(loadCategoryList.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            if (action.payload && action.payload.id) {
                state.values = [
                    ...state.values.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(defaultSort));
            }
        })
        .addCase(saveCategory.fulfilled, (state, action) => {
            if (action.payload && !action.meta.arg.id && !!action.meta.arg.code) {
                state.values = [
                    ...state.values.filter(cat => cat.code !== action.payload?.code),
                    action.payload,
                ].sort(categorySorter(defaultSort));
            } else if (action.payload) {
                state.values = [
                    ...state.values.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(defaultSort));
            }
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            setPreference(localStorageKeys.categoriesRowsPerPage, action.payload);
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
            setPreference(localStorageKeys.categoriesShowInactive, state.showInactive);
        })
});

const currentReducer = createReducer(initialCurrentCategoryState, (builder) => {
    builder
        .addCase(loadCategory.pending, (state, action) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(loadCategory.rejected, (state, action) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveCategory.pending, (state, action) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveCategory.fulfilled, (state, action) => {
            state.saving = QueryStatus.fulfilled
            state.value = action.payload;
        })
        .addCase(saveCategory.rejected, (state, action) => {
            state.saving = QueryStatus.rejected;
        })
        .addCase(setNewCategory, (state) => {
            state.value = {...defaultCategory};
        })
})


const categoriesReducer = combineReducers({
    list: listReducer,
    current: currentReducer,
})
export default categoriesReducer;
