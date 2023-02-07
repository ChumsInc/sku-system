import {combineReducers} from "redux";
import {SortProps} from "chums-components";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {SKUGroup} from "chums-types";
import {
    createDefaultListActions,
    CurrentValueState,
    initialCurrentValueState,
    initialListState,
    ListState
} from "../redux-utils";
import {fetchSKUGroup, fetchSKUGroups, postSKUGroup} from "../../api/skuGroups";
import {RootState} from "../../app/configureStore";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {selectIsAdmin} from "../users";

export const defaultSkuGroupSort: SortProps<SKUGroup> = {field: 'code', ascending: true};

export const defaultSKUGroup: SKUGroup = {
    id: 0,
    code: '',
    description: '',
    notes: null,
    tags: {},
    active: true,
    productLine: '',
}

export const initialSKUGroupListState = (): ListState<SKUGroup> => ({
    ...initialListState,
    rowsPerPage: getPreference<number>(localStorageKeys.groupsRowsPerPage, 25),
    sort: {...defaultSkuGroupSort},
    showInactive: getPreference(localStorageKeys.groupListShowInactive, false),
});

export const initialCurrentSKUGroup: CurrentValueState<SKUGroup> = {
    ...initialCurrentValueState,
}

export const {
    setSearch,
    setPage,
    setRowsPerPage,
    toggleShowInactive,
    setSort
} = createDefaultListActions<SKUGroup>('skuGroup/list');

export const selectSearch = (state: RootState) => state.skuGroups.list.search;
export const selectFilterInactive = (state: RootState) => state.skuGroups.list.showInactive;
export const selectList = (state: RootState): SKUGroup[] => state.skuGroups.list.values;
export const selectPage = (state: RootState) => state.skuGroups.list.page;
export const selectRowsPerPage = (state: RootState) => state.skuGroups.list.rowsPerPage;
export const selectSort = (state: RootState) => state.skuGroups.list.sort;

export const selectFilteredList = createSelector(
    [selectList, selectSearch, selectFilterInactive, selectSort],
    (list, search, filterInactive, sort) => {
        let re = /^/i;
        try {
            re = new RegExp(search, 'i');
        } catch (err) {
        }

        return list
            .filter(group => !filterInactive || group.active)
            .filter(group => re.test(group.code) || re.test(group.description) || re.test(group.notes || ''))
            .sort(skuGroupSorter(sort));
    }
)

export const selectInactiveCount = (state: RootState) => state.skuGroups.list.values.filter(g => !g.active).length;
export const selectCurrentSKUGroup = (state: RootState) => state.skuGroups.current.value;
export const selectListLoading = (state: RootState) => state.skuGroups.list.loading === QueryStatus.pending;
export const selectListLoaded = (state: RootState) => state.skuGroups.list.loaded;
export const selectLoading = (state: RootState) => state.skuGroups.current.loading === QueryStatus.pending;
export const selectSaving = (state: RootState) => state.skuGroups.current.saving === QueryStatus.pending;

export const setNewSKUGroup = createAction('skuGroup/current/new');

export const loadSKUGroup = createAsyncThunk<SKUGroup | null, SKUGroup>(
    'skuGroup/current/load',
    async (arg) => {
        return await fetchSKUGroup(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state) && !selectSaving(state);
        }
    }
)


export const loadSKUGroupList = createAsyncThunk<SKUGroup[]>(
    'skuGroups/list/load',
    async () => {
        return await fetchSKUGroups();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectListLoading(state);
        }
    }
)

export const saveSKUGroup = createAsyncThunk<SKUGroup, SKUGroup>(
    'skuGroups/current/save',
    async (arg) => {
        return await postSKUGroup(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectIsAdmin(state) && !selectLoading(state) && !selectSaving(state);
        }
    }
)

export const defaultSort: SortProps<SKUGroup> = {field: 'code', ascending: true};

export const skuGroupKey = (group: SKUGroup) => group.id;
export const skuGroupSorter = ({field, ascending}: SortProps<SKUGroup>) =>
    (a: SKUGroup, b: SKUGroup) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (skuGroupKey(a) > skuGroupKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }

const skuGroupListReducer = createReducer(initialSKUGroupListState, (builder) => {
    builder
        .addCase(setSearch, (state, action) => {
            state.search = action.payload;
            state.page = 0;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
            setPreference(localStorageKeys.groupListShowInactive, state.showInactive);
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
            setPreference<number>(localStorageKeys.groupsRowsPerPage, action.payload);
        })
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(loadSKUGroupList.pending, (state, action) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadSKUGroupList.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.values = action.payload.sort(skuGroupSorter(defaultSort));
        })
        .addCase(loadSKUGroupList.typePrefix, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(loadSKUGroup.fulfilled, (state, action) => {
            if (action.payload) {
                state.values = [
                    ...state.values.filter(group => group.id !== action.payload?.id),
                    action.payload
                ]
            }
        })
        .addCase(saveSKUGroup.fulfilled, (state, action) => {
            state.values = [
                ...state.values.filter(group => group.id !== action.payload.id),
                action.payload
            ]
        })
});

const currentSKUGroupReducer = createReducer(initialCurrentSKUGroup, (builder) => {
    builder
        .addCase(loadSKUGroupList.fulfilled, (state, action) => {
            const [current] = action.payload.filter(group => group.id === state.value?.id);
            if (current) {
                state.value = current;
            }
        })
        .addCase(loadSKUGroup.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadSKUGroup.fulfilled, (state, action) => {
            state.loading = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(loadSKUGroup.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
        .addCase(saveSKUGroup.pending, (state) => {
            state.saving = QueryStatus.pending;
        })
        .addCase(saveSKUGroup.fulfilled, (state, action) => {
            state.saving = QueryStatus.fulfilled;
            state.value = action.payload;
        })
        .addCase(saveSKUGroup.rejected, (state) => {
            state.saving = QueryStatus.rejected;
        })
        .addCase(setNewSKUGroup, (state) => {
            state.value = {...defaultSKUGroup};
        })
});

const skuGroupsReducer = combineReducers({
    list: skuGroupListReducer,
    current: currentSKUGroupReducer,
});


export default skuGroupsReducer;
