import {QueryStatus} from "@reduxjs/toolkit/query";
import {SortProps} from "chums-components";
import {createAction} from "@reduxjs/toolkit";

export interface ListState<T=any> {
    values: T[];
    loading:QueryStatus,
    loaded: boolean;
    search: string;
    filterInactive: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<T>
}

export interface CurrentValueState<T=any> {
    value:T|null;
    loading: QueryStatus;
    saving: QueryStatus
}

export const initialListState:Omit<ListState, 'sort'> = {
    values: [],
    loading: QueryStatus.uninitialized,
    loaded: false,
    search: '',
    filterInactive: false,
    page: 0,
    rowsPerPage: 25
}

export const initialCurrentValueState:CurrentValueState = {
    value: null,
    loading: QueryStatus.uninitialized,
    saving: QueryStatus.uninitialized
}

export const createDefaultListActions = <T=any>(prefix:string) => {
    return {
        setPage: createAction<number>(`${prefix}/setPage`),
        setRowsPerPage: createAction<number>(`${prefix}/setRowsPerPage`),
        setSearch: createAction<string>(`${prefix}/setSearch`),
        toggleFilterInactive: createAction<boolean|undefined>(`${prefix}/toggleFilterInactive`),
        setSort: createAction<SortProps<T>>(`${prefix}/setSort`)
    }
}
