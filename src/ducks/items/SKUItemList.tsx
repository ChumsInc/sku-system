/**
 * Created by steve on 3/24/2017.
 */

import React, {ChangeEvent, useEffect} from 'react';
import GTIN from '../../GTIN';
import {useDispatch, useSelector} from 'react-redux';
import TrimmedText from "../../components/TrimmedText";
import {Product, ProductSorterProps, ProductTableField} from "../../types";
import ColorUPCButton from "./ColorUPCButton";
import {
    filterInactiveChangedAction, loadSKUItemsAction,
    searchChangedAction,
    selectFilterInactive,
    selectItemList, selectItemsCount,
    selectLoading,
    selectSearch
} from "./index";
import {
    addPageSetAction, Alert,
    FormCheck,
    pagedDataSelector, PagerDuck,
    selectTableSort,
    setPageAction,
    SortableTable,
    SpinnerButton,
    tableAddedAction
} from "chums-ducks";
import {selectSelectedSKU} from "../sku/selectors";
import classNames from "classnames";

const tableFields: ProductTableField[] = [
    {field: 'company', title: 'Co', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'ItemCodeDesc', title: 'Desc', sortable: true, render: (row) => (<TrimmedText text={row.ItemCodeDesc}/>)},
    {field: 'ProductType', title: 'PT', sortable: true},
    {field: 'ItemStatus', title: 'Status', sortable: true},
    {field: 'UDF_UPC', title: 'UPC', className: 'upc', sortable: true, render: (row) => GTIN.format(row.UDF_UPC),},
    {field: 'UDF_UPC_BY_COLOR', title: 'Color UPC', sortable: true, render: (row) => (<ColorUPCButton item={row}/>)}

];

const tableId = 'sku-item-list';
const SKUItemList: React.FC = () => {
    const dispatch = useDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const loading = useSelector(selectLoading)
    const sort = useSelector(selectTableSort(tableId)) as ProductSorterProps;
    const sku = useSelector(selectSelectedSKU);
    const list = useSelector(selectItemList(sort));
    const listLength = useSelector(selectItemsCount);
    const pagedList = useSelector(pagedDataSelector(tableId, list));

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'ItemCode', ascending: true}));
        dispatch(addPageSetAction({key: tableId}));
    }, []);

    useEffect(() => {
        dispatch(setPageAction({current: 1, key: tableId}));
    }, [sku.id]);

    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => dispatch(searchChangedAction(ev.target.value));
    const onToggleFilterInactive = () => dispatch(filterInactiveChangedAction());
    const onClickReload = () => dispatch(loadSKUItemsAction(sku));

    const rowClassName = (row:Product) => classNames({
        'text-danger': row.InactiveItem === 'Y' || row.ProductType === 'D',
    })

    return (
        <div>
            <h3>Sage Items</h3>
            <div className="row g-3">
                <div className="col-auto">
                    <input type="search" placeholder="Search" value={search}
                           onChange={onChangeFilter} className="form-control form-control-sm"/>
                </div>
                <div className="col-auto">
                    <FormCheck label="Show Inactive" checked={!filterInactive} onClick={onToggleFilterInactive}
                               type="checkbox"/>
                </div>
                <div className="col-auto">
                    <SpinnerButton spinning={loading} size="sm" color="primary" onClick={onClickReload}>Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable tableKey={tableId} data={pagedList} fields={tableFields} keyField="ItemCode" size="xs"
                           rowClassName={rowClassName}/>
            {!sku.id && <Alert color="info">Select SKU</Alert>}
            {!!sku.id && !loading && !listLength && <Alert color="warning">No Items</Alert>}
            <PagerDuck dataLength={list.length} pageKey={tableId} filtered={list.length !== listLength}/>
        </div>
    )
}

export default SKUItemList;
