import {ActionInterface, ActionPayload, buildPath, fetchJSON} from "chums-ducks";
import {ProductMix, ProductMixField, SKUGroup, SKUGroupField, SKUGroupSorterProps} from "../../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {selectIsAdmin} from "../users";
import {combineReducers} from "redux";
import {settingsFetchRequested, fetchSettingsSucceeded} from "../settings";
import {mixChanged, mixesFilterInactiveChanged, mixesSearchChanged} from "../mixes";

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


export const defaultSKUGroup: SKUGroup = {
    id: 0,
    code: '',
    description: '',
    notes: null,
    tags: {},
    active: true,
    productLine: '',
}

const groupsSearchChanged = 'groups/searchChanged';
const groupsFilterInactiveChanged = 'groups/filterInactiveChanged';

const fetchListRequested = 'groups/fetchRequested';
const fetchListSucceeded = 'groups/fetchSucceeded';
const fetchListFailed = 'groups/fetchFailed';

const groupSelected = 'groups/selected';
const groupChanged = 'groups/selected/groupChanged';

const fetchGroupRequested = 'groups/selected/fetchRequested';
const fetchGroupSucceeded = 'groups/selected/fetchSucceeded';
const fetchGroupFailed = 'groups/selected/fetchFailed';


const saveGroupRequested = 'groups/selected/saveRequested';
const saveGroupSucceeded = 'groups/selected/saveSucceeded';
const saveGroupFailed = 'groups/selected/saveFailed';

export const searchChangedAction = (search: string) => ({type: groupsSearchChanged, payload: {search}});
export const filterInactiveChangedAction = () => ({type: groupsFilterInactiveChanged});
export const mixChangedAction = (field:SKUGroupField, value: unknown) => ({type: groupChanged, payload: {field, value}});

export const fetchGroupAction = (group:SKUGroup): SKUGroupThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            if (!group.id) {
                return dispatch({type: groupSelected, payload: {group}});
            }
            dispatch({type: fetchGroupRequested});
            const url = buildPath('/api/operations/sku/groups/:id', {id: group.id});
            const {list = []} = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: fetchGroupSucceeded, payload: {group: list[0] || defaultSKUGroup}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchGroupsAction()", error.message);
                return dispatch({type: fetchListFailed, payload: {error, context: fetchGroupRequested}})
            }
            console.error("fetchGroupsAction()", error);
        }
    };

export const fetchListAction = (): SKUGroupThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: fetchListRequested});
            const {list = []} = await fetchJSON('/api/operations/sku/groups', {cache: 'no-cache'});
            dispatch({type: fetchListSucceeded, payload: {skuGroups: list}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchGroupsAction()", error.message);
                return dispatch({type: fetchListFailed, payload: {error, context: fetchListRequested}})
            }
            console.error("fetchGroupsAction()", error);
        }
    };

export const groupChangedAction = (field: SKUGroupField, value: unknown): SKUGroupAction =>
    ({type: groupChanged, payload: {field, value}});

export const saveGroupAction = (group: SKUGroup): SKUGroupThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (!selectIsAdmin(state) || selectLoading(state) || selectSaving(state)) {
                return;
            }
            dispatch({type: saveGroupRequested});
            const response = await fetchJSON('/api/operations/sku/groups', {
                method: 'POST',
                body: JSON.stringify(group)
            });
            dispatch({type: saveGroupSucceeded, payload: {group: response.group}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveGroupAction()", error.message);
                return dispatch({type: saveGroupFailed, payload: {error, context: saveGroupRequested}})
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
export const selectGroupsCount = (state:RootState) => state.groups.list.length;
export const selectActiveGroupsCount = (state:RootState) => state.groups.list.filter(g => g.active).length;
export const selectSelectedSKUGroup = (state: RootState): SKUGroup => state.groups.selected || {...defaultSKUGroup};
export const selectLoading = (state: RootState) => state.groups.loading;
export const selectSaving = (state: RootState) => state.groups.saving;

const searchReducer = (state: string = '', action: SKUGroupAction): string => {
    const {type, payload} = action;
    switch (type) {
    case groupsSearchChanged:
        return payload?.search || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = true, action: SKUGroupAction): boolean => {
    switch (action.type) {
    case groupsFilterInactiveChanged:
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
    case fetchListSucceeded:
        if (payload?.skuGroups) {
            return payload.skuGroups.sort(skuGroupSorter(defaultSort));
        }
        return [];
    case fetchGroupSucceeded:
    case saveGroupSucceeded:
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

const selectedReducer = (state: SKUGroup = defaultSKUGroup, action: SKUGroupAction): SKUGroup => {
    const {type, payload} = action;
    switch (type) {
    case fetchGroupSucceeded:
    case saveGroupSucceeded:
    case groupSelected:
        if (payload?.group) {
            return {...payload.group};
        }
        return {...defaultSKUGroup};
    case fetchListSucceeded:
        if (state && payload?.skuGroups) {
            const [group] = payload.skuGroups.filter(g => g.id === state.id);
            return {...group};
        }
        return state;

    case groupChanged:
        if (state && payload?.field) {
            return {...state, [payload.field]: payload.value, changed: true}
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: SKUGroupAction): boolean => {
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

const selectedLoadingReducer = (state: boolean = false, action: SKUGroupAction): boolean => {
    const {type} = action;
    switch (type) {
    case fetchGroupRequested:
        return true;
    case fetchGroupSucceeded:
    case fetchGroupFailed:
        return false;
    default:
        return state;
    }
};

const savingReducer = (state: boolean = false, action: SKUGroupAction): boolean => {
    const {type} = action;
    switch (type) {
    case saveGroupRequested:
        return true;
    case saveGroupSucceeded:
    case saveGroupFailed:
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
