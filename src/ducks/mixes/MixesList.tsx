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
import {ProductColor, ProductMixTableField, ProductSorterProps} from "../../types";
import {fetchMixAction, selectMix, selectMixesCount, selectMixesList} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";

const tableId = 'mixes-list';

const fields: ProductMixTableField[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes} length={65}/>)}
]

const rowClassName = (row: ProductColor) => classNames({'table-danger': !row.active});

const MixesList: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId)) as ProductSorterProps;
    const list = useSelector(selectMixesList(sort));
    const listLength = useSelector(selectMixesCount);
    const pagedList = useSelector(selectPagedData(tableId, list));
    const selected = useSelector(selectMix);

    const onSelectRow = (row: ProductColor) => dispatch(fetchMixAction(row));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'ItemCode', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
    }, []);

    return (
        <>
            <SortableTable tableKey={tableId} keyField="id" fields={fields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={selected.id} onSelectRow={onSelectRow}/>
            <PagerDuck dataLength={list.length} filtered={list.length !== listLength} pageKey={tableId}/>
        </>
    )
}

export default MixesList;
