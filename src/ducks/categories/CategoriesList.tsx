import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addPageSetAction,
    PagerDuck,
    selectPagedData,
    selectTableSort,
    SortableTable,
    tableAddedAction
} from "chums-ducks";
import {Category, CategoryTableField, SKUGroup, SKUGroupSorterProps, SKUGroupTableField} from "../../types";
import {fetchCategoryAction, selectCategoriesCount, selectCategory, selectSortedList} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import {categoryKey} from "./utils";

const tableId = 'groups-list';

const fields: CategoryTableField[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'productLine', title: 'Product Line', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes} length={65}/>)}
]

const rowClassName = (row: Category) => classNames({'table-danger': !row.active});

const CategoriesList: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId)) as SKUGroupSorterProps;
    const list = useSelector(selectSortedList(sort));
    const listLength = useSelector(selectCategoriesCount);
    const pagedList = useSelector(selectPagedData(tableId, list));
    const selected = useSelector(selectCategory);

    const onSelectRow = (row: Category) => dispatch(fetchCategoryAction(row));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'code', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
    }, []);

    return (
        <>
            <SortableTable tableKey={tableId} keyField={categoryKey} fields={fields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={categoryKey(selected)} onSelectRow={onSelectRow}/>
            <PagerDuck dataLength={list.length} filtered={list.length !== listLength} pageKey={tableId}/>
        </>
    )
}

export default CategoriesList;
