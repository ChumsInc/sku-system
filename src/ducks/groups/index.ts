import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {SKUGroup, SKUGroupField, SKUGroupSorterProps} from "../../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {selectIsAdmin} from "../users";
import {combineReducers} from "redux";
import {settingsFetchRequested, fetchSettingsSucceeded} from "../settings";

export interface SKUGroupPayload extends ActionPayload {
    group?: SKUGroup,
    skuGroups?: SKUGroup[],
    search?: string,
    field?: SKUGroupField,
    value?: unknown
}

export interface SKUGroupAction extends ActionInterface {
    payload?: SKUGroupPayload,
}

export interface SKUGroupThunkAction extends ThunkAction<any, RootState, unknown, SKUGroupAction> {
}

const groupSearchChanged = 'group/searchChanged';
const groupFilterInactiveChanged = 'group/filterInactiveChanged';
const groupSelected = 'group/selected';
const groupSelectedChanged = 'group/selectedChanged';

const groupFetchListRequested = 'group/fetchListRequested';
const groupFetchListSucceeded = 'group/fetchListSucceeded';
const groupFetchListFailed = 'group/fetchListFailed';

const groupFetchRequested = 'group/fetchRequested';
const groupFetchSucceeded = 'group/fetchSucceeded';
const groupFetchFailed = 'group/fetchFailed';

const groupSaveRequested = 'group/saveRequested';
const groupSaveSucceeded = 'group/saveSucceeded';
const groupSaveFailed = 'group/saveFailed';

export const groupSelectedAction = (group: SKUGroup): SKUGroupAction => ({type: groupSelected, payload: {group}});

export const fetchGroupsAction = (): SKUGroupThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: groupFetchListRequested});
            const {list = []} = await fetchJSON('/api/operatons/sku/groups', {cache: 'no-cache'});
            dispatch({type: groupFetchListSucceeded, payload: {skuGroups: list}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchGroupsAction()", error.message);
                return dispatch({type: groupFetchListFailed, payload: {error, context: groupFetchListRequested}})
            }
            console.error("fetchGroupsAction()", error);
        }
    };

export const groupChangedAction = (field: SKUGroupField, value: unknown): SKUGroupAction =>
    ({type: groupSelectedChanged, payload: {field, value}});

export const saveGroupAction = (group: SKUGroup): SKUGroupThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (!selectIsAdmin(state) || selectLoading(state) || selectSaving(state)) {
                return;
            }
            dispatch({type: groupSaveRequested});
            const response = await fetchJSON('/api/operations/sku/groups', {
                method: 'POST',
                body: JSON.stringify(group)
            });
            dispatch({type: groupSaveSucceeded, payload: {group: response.group}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveGroupAction()", error.message);
                return dispatch({type: groupSaveFailed, payload: {error, context: groupSaveRequested}})
            }
            console.error("saveGroupAction()", error);
        }
    };

export const defaultSort: SKUGroupSorterProps = {field: 'code', ascending: true};

export const skuGroupKey = (group: SKUGroup) => group.id;
export const skuGroupSorter = ({field, ascending}: SKUGroupSorterProps) =>
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


export const selectSearch = (state: RootState) => state.groups.search;
export const selectFilterInactive = (state: RootState) => state.groups.filterInactive;
export const selectList = (state:RootState):SKUGroup[] => state.groups.list.sort(skuGroupSorter(defaultSort));
export const selectSortedList = (sort: SKUGroupSorterProps) => (state: RootState): SKUGroup[] => {
    const search = selectSearch(state);
    const filterInactive = selectFilterInactive(state);

    let re = /^/i;
    try {
        re = new RegExp(search, 'i');
    } catch (err) {
    }

    return state.groups.list
        .filter(group => !filterInactive || group.active)
        .filter(group => re.test(group.code) || re.test(group.description) || re.test(group.notes || ''))
        .sort(skuGroupSorter(sort));
}
export const selectSelectedSKUGroup = (state: RootState): SKUGroup | null => state.groups.selected || null;
export const selectLoading = (state: RootState) => state.groups.loading;
export const selectSaving = (state: RootState) => state.groups.saving;

const searchReducer = (state: string = '', action: SKUGroupAction): string => {
    const {type, payload} = action;
    switch (type) {
    case groupSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: SKUGroupAction): boolean => {
    switch (action.type) {
    case groupFilterInactiveChanged:
        return !state;
    default:
        return state;
    }
}

const listReducer = (state: SKUGroup[] = [], action: SKUGroupAction): SKUGroup[] => {
    const {type, payload} = action;
    switch (type) {
    case settingsFetchRequested:
        return [];
    case fetchSettingsSucceeded:
    case groupFetchListSucceeded:
        if (payload?.skuGroups) {
            return payload.skuGroups.sort(skuGroupSorter(defaultSort));
        }
        return [];
    case groupFetchSucceeded:
    case groupSaveSucceeded:
        if (payload?.group) {
            return [
                ...state.filter(group => group.id !== payload.group?.id),
                payload.group
            ];
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state: SKUGroup | null = null, action: SKUGroupAction): SKUGroup | null => {
    const {type, payload} = action;
    switch (type) {
    case groupFetchSucceeded:
    case groupSaveSucceeded:
    case groupSelected:
        if (payload?.group) {
            return {...payload.group};
        }
        return null;
    case groupFetchListSucceeded:
        if (state && payload?.skuGroups) {
            const [group] = payload.skuGroups.filter(g => g.id === state.id);
            return {...group};
        }
        return state;

    case groupSelectedChanged:
        if (state && payload?.field) {
            return {...state, [payload.field]: payload.value}
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: SKUGroupAction): boolean => {
    const {type} = action;
    switch (type) {
    case groupFetchListRequested:
    case groupFetchRequested:
        return true;
    case groupFetchListSucceeded:
    case groupFetchListFailed:
    case groupFetchSucceeded:
    case groupFetchFailed:
        return false;
    default:
        return state;
    }
};

const savingReducer = (state: boolean = false, action: SKUGroupAction): boolean => {
    const {type} = action;
    switch (type) {
    case groupSaveRequested:
        return true;
    case groupSaveSucceeded:
    case groupSaveFailed:
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
})
