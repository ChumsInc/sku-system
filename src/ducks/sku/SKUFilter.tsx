import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectFilterInactive,
    selectSearch,
    selectSelectedGroup,
    selectSKUListActiveLength,
    selectSKUListLength, selectSKUListLoading
} from "./selectors";
import SKUGroupSelect from "../groups/SKUGroupSelect";
import {SKUGroup} from "../../types";
import {
    fetchSKUListAction,
    filterInactiveChangedAction,
    searchChangedAction,
    selectSKUAction,
    selectSKUGroupAction
} from "./actions";
import {FormCheck, SpinnerButton} from "chums-ducks";
import {newProductSKU} from "./actionTypes";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";

const SKUFilter:React.FC = () => {
    const dispatch = useDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const countActive = useSelector(selectSKUListActiveLength);
    const countAll = useSelector(selectSKUListLength);
    const skuGroup = useSelector(selectSelectedGroup);
    const loading = useSelector(selectSKUListLoading);

    const onSelectSKUGroup = (group?:SKUGroup) => dispatch(selectSKUGroupAction(group));
    const onClickFilterInactive = () => dispatch(filterInactiveChangedAction())
    const onChangeSearch = (ev:ChangeEvent<HTMLInputElement>) => dispatch(searchChangedAction(ev.target.value));
    const onClickNewSKU = () => dispatch(selectSKUAction({...newProductSKU}));
    const onClickReload = () => dispatch(fetchSKUListAction(skuGroup?.id))

    return (
        <div className="row g-3">
            <div className="col-auto">
                <label className="form-label">SKU Group</label>
            </div>
            <div className="col-auto">
                <SKUGroupSelect value={skuGroup?.id} allowAllGroups onChange={onSelectSKUGroup} showInactive={!filterInactive}/>
            </div>
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countActive={countActive} countAll={countAll} />
            </div>
            <div className="col-auto">
                <input type="search" value={search || ''} className="form-control form-control-sm"
                       onChange={onChangeSearch} placeholder="Search" />
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-outline-secondary" onClick={onClickNewSKU}>
                    New SKU
                </button>
            </div>
            <div className="col-auto">
                <SpinnerButton className="btn btn-sm btn-primary" onClick={onClickReload} spinning={loading}>Reload</SpinnerButton>
            </div>
        </div>
    )
}
export default SKUFilter;
