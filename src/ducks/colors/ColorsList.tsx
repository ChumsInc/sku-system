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
import {ProductColor, ProductColorField, ProductColorTableField, ProductSorterProps} from "../../types";
import {fetchColorAction, selectColor, selectColorsCount, selectColorsList} from "./index";
import TrimmedText from "../../components/TrimmedText";

const tableId = 'colors-list';

const fields:ProductColorTableField[] = [
    {field: 'code', title: 'Code', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes} length={65}/>)}

]

const ColorsList:React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId)) as ProductSorterProps;
    const list = useSelector(selectColorsList(sort));
    const listLength = useSelector(selectColorsCount);
    const pagedList = useSelector(selectPagedData(tableId, list));
    const selected = useSelector(selectColor);

    const onSelectRow = (row:ProductColor) => dispatch(fetchColorAction(row));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'ItemCode', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
    }, []);

    return (
        <>
            <SortableTable tableKey={tableId} keyField="id" fields={fields} data={pagedList} size="xs"
                           selected={selected.id} onSelectRow={onSelectRow} />
            <PagerDuck dataLength={list.length} filtered={list.length !== listLength} pageKey={tableId} />
        </>
    )
}

export default ColorsList;
