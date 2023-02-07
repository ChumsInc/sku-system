import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";

import {
    loadSKUGroup,
    loadSKUGroupList,
    selectCurrentSKUGroup,
    selectFilteredList,
    selectListLoaded,
    selectPage,
    selectRowsPerPage,
    selectSort,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";
import {SKUGroup} from "chums-types";

const tableId = 'groups-list';

const fields: SortableTableField<SKUGroup>[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'productLine', title: 'Product Line', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes ?? ''} length={65}/>)}
]

const rowClassName = (row: SKUGroup) => classNames({'table-danger': !row.active});

const GroupsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectSort);
    const list = useSelector(selectFilteredList);
    const selected = useSelector(selectCurrentSKUGroup);
    const loaded = useSelector(selectListLoaded);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSKUGroupList());
        }
    }, [])

    const onSelectRow = (row: SKUGroup) => dispatch(loadSKUGroup(row));
    const onChangePage = (page: number) => dispatch(setPage(page));
    const onChangeRowsPerPage = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const sortChangeHandler = (sort: SortProps<SKUGroup>) => dispatch(setSort(sort));

    return (
        <>
            <SortableTable keyField="id" fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           rowClassName={rowClassName}
                           selected={selected?.id} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={onChangePage} rowsPerPage={rowsPerPage}
                             showFirst showLast bsSize="sm"
                             onChangeRowsPerPage={onChangeRowsPerPage} count={list.length}/>
        </>
    )
}

export default GroupsList;
