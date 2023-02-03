import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    selectFilterInactive,
    selectSearch,
    selectSKUGroupFilter,
    selectSKUListActiveLength,
    selectSKUListLength,
    selectSKUListLoading
} from "./selectors";
import SKUGroupSelect from "../groups/SKUGroupSelect";
import {SKUGroup} from "../../types";
import {loadSKU, loadSKUList, setSearch, setSKUGroupFilter, toggleFilterInactive} from "./actions";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";
import {defaultBaseSKU} from "../../api/sku";

const SKUFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const countActive = useSelector(selectSKUListActiveLength);
    const countAll = useSelector(selectSKUListLength);
    const skuGroupId = useSelector(selectSKUGroupFilter);
    const loading = useSelector(selectSKUListLoading);

    const onChangeSKUGroup = (group?: SKUGroup) => dispatch(setSKUGroupFilter(group));
    const onClickFilterInactive = () => dispatch(toggleFilterInactive())
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickNewSKU = () => dispatch(loadSKU({...defaultBaseSKU}));
    const onClickReload = () => dispatch(loadSKUList())

    return (
        <div className="row g-3">
            <div className="col-auto">
                <label className="form-label">SKU Group</label>
            </div>
            <div className="col-auto">
                <SKUGroupSelect value={skuGroupId} allowAllGroups onChange={onChangeSKUGroup}
                                showInactive={!filterInactive}/>
            </div>
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countActive={countActive} countAll={countAll}/>
            </div>
            <div className="col-auto">
                <input type="search" value={search || ''} className="form-control form-control-sm"
                       onChange={onChangeSearch} placeholder="Search"/>
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-outline-secondary" onClick={onClickNewSKU}>
                    New SKU
                </button>
            </div>
            <div className="col-auto">
                <SpinnerButton className="btn btn-sm btn-primary" onClick={onClickReload}
                               spinning={loading}>Reload</SpinnerButton>
            </div>
        </div>
    )
}
export default SKUFilter;
