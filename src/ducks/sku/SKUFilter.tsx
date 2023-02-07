import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    selectShowInactive,
    selectSearch,
    selectSKUGroupFilter,
    selectInactiveCount,
    selectSKUListLength,
    selectListLoading
} from "./selectors";
import SKUGroupSelect from "../groups/SKUGroupSelect";
import {SKUGroup} from "chums-types";
import {loadSKU, loadSKUList, setSearch, setSKUGroupFilter, toggleShowInactive} from "./actions";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";
import {defaultBaseSKU} from "../../api/sku";

const SKUFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);
    const inactive = useSelector(selectInactiveCount);
    const skuGroup = useSelector(selectSKUGroupFilter);
    const loading = useSelector(selectListLoading);

    const onChangeSKUGroup = (group?: SKUGroup) => dispatch(setSKUGroupFilter(group));
    const onClickFilterInactive = () => dispatch(toggleShowInactive())
    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickNewSKU = () => dispatch(loadSKU({...defaultBaseSKU}));
    const onClickReload = () => dispatch(loadSKUList())

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <label className="form-label">SKU Group</label>
            </div>
            <div className="col-auto">
                <SKUGroupSelect value={skuGroup?.id} allowAllGroups onChange={onChangeSKUGroup}
                                showInactive={showInactive}/>
            </div>
            <div className="col-auto">
                <ShowInactiveCheckbox checked={showInactive} onChange={onClickFilterInactive}
                                      countInactive={inactive}/>
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
