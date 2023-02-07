import React from "react";
import {useSelector} from "react-redux";
import {
    loadCategory,
    selectPage,
    selectRowsPerPage,
    selectCategoryList,
    selectCurrentCategory,
    selectSort,
    setPage,
    setRowsPerPage,
    setSort
} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import {categoryKey} from "./utils";
import {useAppDispatch} from "../../app/configureStore";
import {ProductCategory} from "chums-types";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";

const tableId = 'groups-list';

const fields: SortableTableField<ProductCategory>[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'productLine', title: 'Product Line', sortable: true},
    {
        field: 'notes',
        title: 'Notes',
        sortable: true,
        render: ({notes}) => (<TrimmedText text={notes ?? ''} length={65}/>)
    }
]

const rowClassName = (row: ProductCategory) => classNames({'table-danger': !row.active});

const CategoriesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectSort);
    const list = useSelector(selectCategoryList);
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const selected = useSelector(selectCurrentCategory);

    const onSelectRow = (row: ProductCategory) => dispatch(loadCategory(row));

    const onChangePage = (page: number) => dispatch(setPage(page));

    const onChangeRowsPerPage = (rowsPerPage: number) => dispatch(setRowsPerPage(rowsPerPage));

    const sortChangedHandler = (sort: SortProps<ProductCategory>) => {
        dispatch(setSort(sort));
    }

    return (
        <>
            <SortableTable keyField={categoryKey} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           size="xs"
                           currentSort={sort}
                           onChangeSort={sortChangedHandler}
                           rowClassName={rowClassName}
                           selected={categoryKey(selected)} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={onChangePage} bsSize="sm"
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={onChangeRowsPerPage}
                             showFirst showLast
                             count={list.length}/>
        </>
    )
}

export default CategoriesList;
