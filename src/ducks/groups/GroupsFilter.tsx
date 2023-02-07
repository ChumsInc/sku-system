import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    loadSKUGroupList,
    selectFilterInactive,
    selectInactiveCount,
    selectListLoading,
    selectSearch,
    setNewSKUGroup,
    setSearch,
    toggleShowInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";

const GroupsFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const inactive = useSelector(selectInactiveCount);
    const loading = useSelector(selectListLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickFilterInactive = () => dispatch(toggleShowInactive());
    const newSKUGroupHandler = () => dispatch(setNewSKUGroup());
    const onClickReload = () => dispatch(loadSKUGroupList());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countInactive={inactive}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newSKUGroupHandler}>
                    New SKU Group
                </button>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" size="sm" spinning={loading} onClick={onClickReload}>
                    Reload
                </SpinnerButton>
            </div>
        </div>
    )
}
export default GroupsFilter;
