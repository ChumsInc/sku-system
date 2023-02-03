/**
 * Created by steve on 3/24/2017.
 */

import React, {ChangeEvent, useEffect} from 'react';
import GTIN from '../../GTIN';
import {useSelector} from 'react-redux';
import TrimmedText from "../../components/TrimmedText";
import {Product} from "../../types";
import ColorUPCButton from "./ColorUPCButton";
import {
    loadSKUItems,
    selectActiveItemsCount,
    selectFilteredItemList,
    selectFilterInactive,
    selectItemsCount,
    selectLoading,
    selectPage,
    selectRowsPerPage,
    selectSearch,
    selectSort,
    setPage,
    setRowsPerPage,
    setSearch,
    setSort,
    toggleFilterInactive
} from "./index";
import {Alert, SortableTable, SortableTableField, SortProps, SpinnerButton, TablePagination} from "chums-components";
import {selectCurrentSKU} from "../sku/selectors";
import classNames from "classnames";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";
import {formatGTIN} from "@chumsinc/gtin-tools";

const tableFields: SortableTableField<Product>[] = [
    {field: 'company', title: 'Co', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {
        field: 'ItemCodeDesc',
        title: 'Desc',
        sortable: true,
        render: (row: Product) => (<TrimmedText text={row.ItemCodeDesc}/>)
    },
    {field: 'ProductType', title: 'PT', sortable: true},
    {field: 'ItemStatus', title: 'Status', sortable: true},
    {
        field: 'UDF_UPC',
        title: 'UPC',
        className: 'upc',
        sortable: true,
        render: (row: Product) => formatGTIN(row.UDF_UPC || ''),
    },
    {
        field: 'UDF_UPC_BY_COLOR',
        title: 'Color UPC',
        sortable: true,
        render: (row: Product) => (<ColorUPCButton item={row}/>)
    }

];

const tableId = 'sku-item-list';

function SKUItemList() {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const loading = useSelector(selectLoading)
    const sort = useSelector(selectSort);
    const sku = useSelector(selectCurrentSKU);
    const list = useSelector(selectFilteredItemList);
    const page = useSelector(selectPage)
    const rowsPerPage = useSelector(selectRowsPerPage);
    const listLength = useSelector(selectItemsCount);
    const itemActiveCount = useSelector(selectActiveItemsCount);

    useEffect(() => {
        dispatch(loadSKUItems(sku));
    }, [sku])

    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onToggleFilterInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleFilterInactive(ev.target.checked));
    const onClickReload = () => dispatch(loadSKUItems(sku));

    const rowClassName = (row: Product) => classNames({
        'text-danger': row.InactiveItem === 'Y' || row.ProductType === 'D',
    })

    const sortChangeHandler = (sort: SortProps<Product>) => dispatch(setSort(sort));
    const pageChangeHandler = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rpp: number) => dispatch(setRowsPerPage(rpp));

    return (
        <div>
            <h3>Sage Items</h3>
            <div className="row g-3">
                <div className="col-auto">
                    <input type="search" placeholder="Search" value={search}
                           onChange={onChangeFilter} className="form-control form-control-sm"/>
                </div>
                <div className="col-auto">
                    <ShowInactiveCheckbox checked={!filterInactive} onChange={onToggleFilterInactive}
                                          countAll={listLength} countActive={itemActiveCount}/>
                </div>
                <div className="col-auto">
                    <SpinnerButton spinning={loading} size="sm" color="primary"
                                   onClick={onClickReload}>Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={tableFields} keyField="ItemCode" size="xs"
                           currentSort={sort} onChangeSort={sortChangeHandler}

                           rowClassName={rowClassName}/>
            {!sku?.id && <Alert color="info">Select SKU</Alert>}
            {!!sku?.id && !loading && !listLength && <Alert color="warning">No Items</Alert>}
            <TablePagination page={page} onChangePage={pageChangeHandler}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             count={list.length}/>
        </div>
    )
}

export default SKUItemList;
