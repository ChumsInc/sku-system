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
import {
    ProductColor,
    ProductMixTableField,
    ProductSorterProps,
    SKUGroup,
    SKUGroupSorterProps,
    SKUGroupTableField
} from "../../types";
import {fetchGroupAction, selectSelectedSKUGroup, selectGroupsCount, selectList, selectSortedList} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";

const tableId = 'groups-list';

const fields: SKUGroupTableField[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'productLine', title: 'Product Line', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes} length={65}/>)}
]

const rowClassName = (row: SKUGroup) => classNames({'table-danger': !row.active});

const GroupsList: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId)) as SKUGroupSorterProps;
    const list = useSelector(selectSortedList(sort));
    const listLength = useSelector(selectGroupsCount);
    const pagedList = useSelector(selectPagedData(tableId, list));
    const selected = useSelector(selectSelectedSKUGroup);

    const onSelectRow = (row: SKUGroup) => dispatch(fetchGroupAction(row));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'ItemCode', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
    }, []);

    return (
        <>
            <SortableTable tableKey={tableId} keyField="id" fields={fields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={selected?.id} onSelectRow={onSelectRow}/>
            <PagerDuck dataLength={list.length} filtered={list.length !== listLength} pageKey={tableId}/>
        </>
    )
}

export default GroupsList;
