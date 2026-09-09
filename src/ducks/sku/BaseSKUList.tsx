import {Fragment, useEffect} from 'react';
import {useSelector} from 'react-redux';
import TrimmedText from "../../components/TrimmedText";
import {SortableTable, type SortableTableField, TablePagination,} from "@chumsinc/sortable-tables";
import {
    selectFilteredSKUList,
    selectListLoaded,
    selectPage,
    selectRowsPerPage,
    selectCurrentSKU,
    selectListLoading,
    selectSort
} from "./selectors";
import {loadSKU, loadSKUList, setPage, setRowsPerPage, setSort} from "./actions";
import classNames from "classnames";
import {loadSKUItems} from "../items";
import {useAppDispatch} from "../../app/configureStore";
import type {BaseSKU} from "chums-types";
import {formatGTIN} from "@chumsinc/gtin-tools";
import {ProgressBar} from "react-bootstrap";


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

const rowClassName = (row: BaseSKU) => classNames({
    'text-danger': !row.active,
})

const BaseSKUList = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectListLoading);
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
            {loading && <ProgressBar animated striped now={100}  className="mb-1"/>}
            <SortableTable keyField={"sku"} fields={tableFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           currentSort={sort}
                           onChangeSort={(sort) => dispatch(setSort(sort))}
                           rowClassName={rowClassName}
                           selected={selected?.sku}
                           onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler} rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: rowsPerPageChangeHandler}} count={list.length} size="sm"/>
        </Fragment>
    )
}

export default BaseSKUList;
