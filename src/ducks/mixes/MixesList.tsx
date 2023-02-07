import React from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {
    loadMix,
    selectCurrentMix,
    selectFilteredMixesList,
    selectPage,
    selectRowsPerPage,
    selectSort,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import {ProductMixInfo} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";

const tableId = 'mixes-list';

const fields: SortableTableField<ProductMixInfo>[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: (row) => (<TrimmedText text={row.notes ?? ''} length={65}/>)}
]

const rowClassName = (row: ProductMixInfo) => classNames({'text-danger': !row.active});

const MixesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectSort);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const list = useSelector(selectFilteredMixesList);
    const selected = useSelector(selectCurrentMix);

    const onSelectRow = (row: ProductMixInfo) => dispatch(loadMix(row.id));
    const onChangePage = (page: number) => dispatch(setPage(page));
    const onChangeRowsPerPage = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const sortChangedHandler = (sort: SortProps<ProductMixInfo>) => dispatch(setSort(sort));

    return (
        <>
            <SortableTable keyField="id" fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           onChangeSort={sortChangedHandler} currentSort={sort}
                           size="xs"
                           rowClassName={rowClassName}
                           selected={selected?.id} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={onChangePage} rowsPerPage={rowsPerPage}
                             showFirst showLast bsSize="sm"
                             onChangeRowsPerPage={onChangeRowsPerPage} count={list.length}/>
        </>
    )
}

export default MixesList;
