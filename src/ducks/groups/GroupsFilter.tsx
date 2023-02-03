import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    defaultSKUGroup,
    loadSKUGroupList,
    loadSKUGroup,
    toggleFilterInactive,
    setSearch,
    selectActiveGroupsCount,
    selectFilterInactive,
    selectListLoading,
    selectGroupsCount,
    selectSearch
} from "./index";
import {SpinnerButton} from "chums-ducks";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";

const GroupsFilter: React.FC = () => {
    const dispatch = useDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const mixesCount = useSelector(selectGroupsCount);
    const activeMixesCount = useSelector(selectActiveGroupsCount);
    const loading = useSelector(selectListLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickFilterInactive = () => dispatch(toggleFilterInactive());
    const onClickNewColor = () => dispatch(loadSKUGroup(defaultSKUGroup));
    const onClickReload = () => dispatch(loadSKUGroupList());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countAll={mixesCount} countActive={activeMixesCount}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNewColor}>
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
