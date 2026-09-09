import {QueryStatus} from "@reduxjs/toolkit/query";
import type {SortProps} from "chums-types";
import {createAction} from "@reduxjs/toolkit";

export interface ListState<T=unknown> {
    values: T[];
    loading:QueryStatus,
    loaded: boolean;
    search: string;
    showInactive: boolean;
    page: number;
    rowsPerPage: number;
    sort: SortProps<T>
}

export interface CurrentValueState<T=unknown> {
    value:T|null;
    loading: QueryStatus;
    saving: QueryStatus
}

export type InitialListState<T = unknown> = Omit<ListState<T>, 'sort'>

export const initialListState:InitialListState = {
    values: [],
    loading: QueryStatus.uninitialized,
    loaded: false,
    search: '',
    showInactive: false,
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
        toggleShowInactive: createAction<boolean|undefined>(`${prefix}/toggleShowInactive`),
        setSort: createAction<SortProps<T>>(`${prefix}/setSort`)
    }
}
