import {RootState} from './../../app/configureStore'
import {categorySorter} from "./utils";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {defaultCategory, fetchCategory, fetchCategoryList, postCategory} from "../../api/categories";
import {ProductCategory} from "chums-types";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {selectIsAdmin} from "../users";

const defaultSort: SortProps<ProductCategory> = {
    field: 'id',
    ascending: true,
}

export interface CategoriesState {
    search: string;
    filterInactive: boolean;
    list: ProductCategory[];
    loadingList: QueryStatus;
    saving: QueryStatus;
    selected: ProductCategory | null;
    loadingCategory: QueryStatus;
    sort: SortProps<ProductCategory>;
    page: number;
    rowsPerPage: number;
}

const initialCategoriesState: CategoriesState = {
    search: '',
    filterInactive: true,
    list: [],
    loadingList: QueryStatus.uninitialized,
    saving: QueryStatus.uninitialized,
    selected: null,
    loadingCategory: QueryStatus.uninitialized,
    sort: {...defaultSort},
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.categoriesRowsPerPage, 25),
}

export const setCategoriesSearch = createAction<string>('categories/searchChanged');

export const categoriesToggleFilterInactive = createAction<boolean | undefined>('categories/toggleFilterInactive');

export const setNewCategory = createAction('categories/setNewCategory');

export const setPage = createAction<number>('categories/setPage');

export const setRowsPerPage = createAction<number>('categories/setRowsPerPage');

export const setSort = createAction<SortProps<ProductCategory>>('categories/setSort');


export const loadCategoryList = createAsyncThunk<ProductCategory[]>(
    'categories/loadCategoriesList',
    async () => {
        return await fetchCategoryList();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCategoryListLoading(state) && !selectCategorySaving(state);
        }
    }
)

export const loadCategory = createAsyncThunk<ProductCategory | null, ProductCategory>(
    'categories/loadCategory',
    async (arg) => {
        return await fetchCategory(arg.id);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCategoryListLoading(state);
        }
    }
)

export const saveCategory = createAsyncThunk<ProductCategory, ProductCategory>(
    'categories/saveCategory',
    async (arg) => {
        return await postCategory(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectCategorySaving(state);
        }
    }
)

const categoriesReducer = createReducer(initialCategoriesState, (builder) => {
    builder
        .addCase(setCategoriesSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(categoriesToggleFilterInactive, (state, action) => {
            state.filterInactive = action.payload ?? !state.filterInactive;
        })
        .addCase(setNewCategory, (state, action) => {
            state.selected = {...defaultCategory};
        })
        .addCase(loadCategoryList.pending, (state) => {
            state.loadingList = QueryStatus.pending;
        })
        .addCase(loadCategoryList.fulfilled, (state, action) => {
            state.loadingList = QueryStatus.fulfilled;
            state.list = action.payload.sort(categorySorter(defaultSort));
        })
        .addCase(loadCategoryList.fulfilled, (state) => {
            state.loadingList = QueryStatus.rejected;
        })
        .addCase(loadCategory.pending, (state, action) => {
            state.loadingCategory = QueryStatus.pending;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            state.loadingCategory = QueryStatus.fulfilled;
            if (action.payload && action.payload.id) {
                state.list = [
                    ...state.list.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(defaultSort));
            }
        })
        .addCase(loadCategory.rejected, (state, action) => {
            state.loadingCategory = QueryStatus.rejected;
        })
        .addCase(saveCategory.pending, (state, action) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveCategory.fulfilled, (state, action) => {
            state.saving = QueryStatus.fulfilled
            state.selected = action.payload;
            if (action.payload) {
                state.list = [
                    ...state.list.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(defaultSort));
            }
        })
        .addCase(saveCategory.rejected, (state, action) => {
            state.saving = QueryStatus.rejected;
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
        })
})


export const selectSearch = (state: RootState) => state.categories.search;

export const selectFilterInactive = (state: RootState) => state.categories.filterInactive;

export const selectList = (state: RootState) => state.categories.list;

export const selectSort = (state: RootState) => state.categories.sort;

export const selectCategoryList = createSelector(
    [selectList, selectSort, selectFilterInactive, selectSearch],
    (list, sort, inactive, search) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(cat => !inactive || cat.active)
            .filter(cat => re.test(cat.code) || re.test(cat.description ?? '') || re.test(cat.notes ?? ''))
            .sort(categorySorter(sort));
    }
)

export const selectCategoriesCount = (state: RootState) => state.categories.list.length;

export const selectActiveCategoriesCount = (state: RootState) => state.categories.list.filter(g => g.active).length;

export const selectCurrentCategory = (state: RootState): ProductCategory | null => state.categories.selected;

export const selectCategoryListLoading = (state: RootState) => state.categories.loadingList === QueryStatus.pending;

export const selectCategoryLoading = (state: RootState) => state.categories.loadingCategory === QueryStatus.pending;

export const selectCategorySaving = (state: RootState) => state.categories.saving === QueryStatus.pending;

export const selectCategoriesPage = (state:RootState) => state.categories.page;

export const selectCategoriesRowsPerPage = (state:RootState) => state.categories.rowsPerPage;


export default categoriesReducer;
