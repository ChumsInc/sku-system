import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadColorUPC,
    loadColorUPCList,
    searchChanged,
    selectActiveColorUPCCount,
    selectColorUPCCount,
    selectFilterInactive,
    selectLoading,
    selectSearch,
    toggleFilterInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";
import {defaultColorUPC} from "../../api/colorUPC";

const ColorUPCFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const categoriesCount = useSelector(selectColorUPCCount);
    const activeCategoriesCount = useSelector(selectActiveColorUPCCount);
    const loading = useSelector(selectLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(searchChanged(ev.target.value));
    const onClickFilterInactive = () => dispatch(toggleFilterInactive());
    const onClickNew = () => dispatch(loadColorUPC(defaultColorUPC));
    const onClickReload = () => dispatch(loadColorUPCList());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countAll={categoriesCount} countActive={activeCategoriesCount}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNew}>
                    New Color UPC
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
export default ColorUPCFilter;
