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
import {Category, ColorUPC, ColorUPCSorterProps, ColorUPCTableField} from "../../types";
import {fetchColorUPCAction, fetchListAction, selectColorUPC, selectColorUPCCount, selectColorUPCList} from "./index";
import TrimmedText from "../../components/TrimmedText";
import classNames from "classnames";
import GTIN from "../../GTIN";

const tableId = 'color-upc-list';

const tableFields: ColorUPCTableField[] = [
    {field: 'company', title: 'Company', sortable: true},
    {field: 'ItemCode', title: 'Item Code', sortable: true},
    {field: 'ItemCodeDesc', title: 'Desc', sortable: true},
    {field: 'ProductType', title: 'Type', sortable: true},
    {field: 'upc', title: 'UPC', sortable: true, render: (row: ColorUPC) => GTIN.format(row.upc), className: 'upc'},
    {field: 'notes', title: 'Notes', sortable: true, render: (row: ColorUPC) => (<TrimmedText text={row.notes || ''} length={35}/>)},
];


const rowClassName = (row: ColorUPC) => classNames({
    'text-danger': !row.active,
    'table-warning': row.active && !row.ProductType,
});

const ColorUPCList: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId)) as ColorUPCSorterProps;
    const list = useSelector(selectColorUPCList(sort));
    const listLength = useSelector(selectColorUPCCount);
    const pagedList = useSelector(selectPagedData(tableId, list));
    const selected = useSelector(selectColorUPC);

    const onSelectRow = (row: ColorUPC) => dispatch(fetchColorUPCAction(row));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'upc', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
        dispatch(fetchListAction());
    }, []);

    return (
        <>
            <SortableTable tableKey={tableId} keyField="upc" fields={tableFields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={selected.upc} onSelectRow={onSelectRow}/>
            <PagerDuck dataLength={list.length} filtered={list.length !== listLength} pageKey={tableId}/>
        </>
    )
}

export default ColorUPCList;
