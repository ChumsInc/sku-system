import React, {Fragment, useEffect} from 'react';
import {useSelector} from 'react-redux';
import TrimmedText from "../../components/TrimmedText";
import {LoadingProgressBar, SortableTable, SortableTableField, TablePagination,} from "chums-components";
import {
    selectFilteredSKUList,
    selectListLoaded,
    selectPage,
    selectRowsPerPage,
    selectCurrentSKU,
    selectSKUListLoading,
    selectSort
} from "./selectors";
import {loadSKU, loadSKUList, setPage, setRowsPerPage, setSort} from "./actions";
import classNames from "classnames";
import {loadSKUItems} from "../items";
import {useAppDispatch} from "../../app/configureStore";
import {BaseSKU} from "chums-types";
import {formatGTIN} from "@chumsinc/gtin-tools";


const tableFields: SortableTableField<BaseSKU>[] = [
    {field: 'sku', title: 'SKU', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'upc', title: 'UPC', sortable: true, render: (row) => formatGTIN(row.upc ?? ''), className: 'upc'},
    {
        field: 'notes',
        title: 'Notes',
        sortable: true,
        render: ({notes}) => (<TrimmedText text={notes ?? ''} length={25}/>)
    }
];

const tableID = 'main-sku-list';

const rowClassName = (row: BaseSKU) => classNames({
    'text-danger': !row.active,
})

const BaseSKUList = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectSKUListLoading);
    const loaded = useSelector(selectListLoaded);
    const sort = useSelector(selectSort);
    const list = useSelector(selectFilteredSKUList);
    const page = useSelector(selectPage)
    const rowsPerPage = useSelector(selectRowsPerPage);
    const selected = useSelector(selectCurrentSKU);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSKUList())
        }
    }, []);

    const onSelectRow = (sku: BaseSKU) => {
        dispatch(loadSKU(sku));
        dispatch(loadSKUItems(sku));
    }

    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <Fragment>
            {loading && <LoadingProgressBar animated striped className="mb-1"/>}
            <SortableTable keyField={"Category4"} fields={tableFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           currentSort={sort}
                           onChangeSort={(sort) => dispatch(setSort(sort))}
                           rowClassName={rowClassName}
                           selected={selected?.Category4}
                           onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler} rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={rowsPerPageChangeHandler} count={list.length}/>
        </Fragment>
    )
}

export default BaseSKUList;
