import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    loadColorsList,
    loadProductColor,
    selectShowInactive,
    selectInactiveCount,
    selectListLoading,
    selectSearch,
    setSearch,
    toggleShowInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {defaultProductColor} from "../../api/color";
import {useAppDispatch} from "../../app/configureStore";

const ColorsFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);
    const inactive = useSelector(selectInactiveCount);
    const loading = useSelector(selectListLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const handleToggleShowInactive = () => dispatch(toggleShowInactive());
    const onClickNewColor = () => dispatch(loadProductColor(defaultProductColor));
    const onClickReload = () => dispatch(loadColorsList());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={showInactive} onChange={handleToggleShowInactive}
                                      countInactive={inactive}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNewColor}>
                    New Color
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
export default ColorsFilter;
