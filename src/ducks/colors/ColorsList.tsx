import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {ProductColor} from "chums-types";
import {
    loadColorsList,
    loadProductColor,
    selectColorsListLoaded,
    selectCurrentColor,
    selectFilteredColorsList,
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


const fields: SortableTableField<ProductColor>[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {
        field: 'notes',
        title: 'Notes',
        sortable: true,
        render: ({notes}) => (<TrimmedText text={notes ?? ''} length={65}/>)
    }

]

const rowClassName = (row: ProductColor) => classNames({'table-danger': !row.active});

const ColorsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectSort);
    const list = useSelector(selectFilteredColorsList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const selected = useSelector(selectCurrentColor);
    const loaded = useSelector(selectColorsListLoaded);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadColorsList());
        }
    }, []);

    const onSelectRow = (row: ProductColor) => dispatch(loadProductColor(row));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));
    const sortChangeHandler = (sort: SortProps<ProductColor>) => dispatch(setSort(sort));

    return (
        <>
            <SortableTable keyField="id" fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           size="xs"
                           rowClassName={rowClassName}
                           selected={selected?.id} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast bsSize="sm"
                             count={list.length}/>
        </>
    )
}

export default ColorsList;
