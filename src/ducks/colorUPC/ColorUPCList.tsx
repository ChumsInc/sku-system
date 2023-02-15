import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {
    loadColorUPC,
    loadColorUPCList,
    selectColorUPCList,
    selectCurrentColorUPC,
    selectPage,
    selectRowsPerPage,
    selectSort,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import GTIN from "../../GTIN";
import {useAppDispatch} from "../../app/configureStore";
import {ProductColorUPC, ProductColorUPCResponse} from "chums-types";

const tableFields: SortableTableField<ProductColorUPCResponse>[] = [
    {field: 'company', title: 'Company', sortable: true},
    {field: 'ItemCode', title: 'Item Code', sortable: true},
    {field: 'ItemCodeDesc', title: 'Desc', sortable: true},
    {field: 'ProductType', title: 'Type', sortable: true},
    {
        field: 'upc',
        title: 'UPC',
        sortable: true,
        render: (row: ProductColorUPCResponse) => GTIN.format(row.upc),
        className: 'upc'
    },
    {
        field: 'notes',
        title: 'Notes',
        sortable: true,
        render: (row: ProductColorUPCResponse) => (<TrimmedText text={row.notes || ''} length={35}/>)
    },
];


const rowClassName = (row: ProductColorUPCResponse) => classNames({
    'text-danger': !row.active,
    'table-warning': row.active && !row.ProductType,
});

const ColorUPCList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectColorUPCList);
    const page = useSelector(selectPage)
    const rowsPerPage = useSelector(selectRowsPerPage);
    const selected = useSelector(selectCurrentColorUPC);
    const sort = useSelector(selectSort);

    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const sortChangeHandler = (sort: SortProps<ProductColorUPC>) => {
        dispatch(setSort(sort));
    }

    const onSelectRow = (row: ProductColorUPCResponse) => dispatch(loadColorUPC(row));

    useEffect(() => {
        dispatch(loadColorUPCList());
    }, []);

    return (
        <>
            <SortableTable keyField="upc" fields={tableFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           onChangeSort={sortChangeHandler}
                           currentSort={sort}
                           rowClassName={rowClassName}
                           selected={selected?.upc} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler} rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast bsSize="sm"
                             count={list.length}/>
        </>
    )
}

export default ColorUPCList;
