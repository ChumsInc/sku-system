import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    loadColorsList,
    loadProductColor,
    selectActiveColorsCount,
    selectColorsCount,
    selectFilterInactive,
    selectLoading,
    selectSearch,
    setSearch,
    toggleFilterInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {defaultProductColor} from "../../api/color";
import {useAppDispatch} from "../../app/configureStore";

const ColorsFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const colorsCount = useSelector(selectColorsCount);
    const activeColorsCount = useSelector(selectActiveColorsCount);
    const loading = useSelector(selectLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickFilterInactive = () => dispatch(toggleFilterInactive());
    const onClickNewColor = () => dispatch(loadProductColor(defaultProductColor));
    const onClickReload = () => dispatch(loadColorsList());

    return (
        <div className="row g-3">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={!filterInactive} onChange={onClickFilterInactive}
                                      countAll={colorsCount} countActive={activeColorsCount}/>
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
