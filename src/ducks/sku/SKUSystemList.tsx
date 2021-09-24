import React, {Fragment, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import GTIN from "../../GTIN";
import TrimmedText from "../../components/TrimmedText";
import {ProductSKU, ProductSKUSorterProps, ProductSKUTableField} from "../../types";
import {
    addPageSetAction,
    LoadingProgressBar,
    pagedDataSelector,
    sortableTableSelector,
    tableAddedAction,
    SortableTable,
    PagerDuck,
} from "chums-ducks";
import {selectSelectedSKU, selectSKUList, selectSKUListLoading} from "./selectors";
import {fetchSKUListAction, selectSKUAction} from "./actions";
import classNames from "classnames";
import {loadSKUItemsAction} from "../items";

const tableFields: ProductSKUTableField[] = [
    {field: 'sku', title: 'SKU', sortable: true},
    {field: 'description', title: 'Description', sortable: true},
    {field: 'upc', title: 'UPC', sortable: true, render: (row) => GTIN.format(row.upc), className: 'upc'},
    {field: 'notes', title: 'Notes', sortable: true, render: ({notes}) => (<TrimmedText text={notes} length={25}/>)}
];

const tableID = 'main-sku-list';

const rowClassName = (row:ProductSKU) => classNames({
    'text-danger': !row.active,
})

const SKUSystemList: React.FC = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectSKUListLoading);
    const sort = useSelector(sortableTableSelector(tableID));
    const list: ProductSKU[] = useSelector(selectSKUList(sort as ProductSKUSorterProps));
    const pagedList = useSelector(pagedDataSelector(tableID, list));
    const selected = useSelector(selectSelectedSKU);

    const onSelectRow = (sku:ProductSKU) => {
        dispatch(selectSKUAction(sku));
        dispatch(loadSKUItemsAction(sku));
    }

    useEffect(() => {
        dispatch(addPageSetAction({key: tableID}));
        dispatch(tableAddedAction({key: tableID, field: 'sku', ascending: true}));
        if (!loading) {
            dispatch(fetchSKUListAction())
        }
    }, []);

    return (
        <Fragment>
            {loading && <LoadingProgressBar animated striped className="mb-1"/>}
            <SortableTable tableKey={tableID} keyField={"id"} fields={tableFields} data={pagedList} size="xs"
                           rowClassName={rowClassName}
                           selected={selected.id} onSelectRow={onSelectRow}/>
            <PagerDuck dataLength={list.length} pageKey={tableID} />
        </Fragment>
    )
}

export default SKUSystemList;
