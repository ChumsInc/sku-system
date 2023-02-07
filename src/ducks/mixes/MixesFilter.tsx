import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    loadMix,
    loadMixes,
    selectShowInactive,
    selectInactiveCount,
    selectLoading,
    selectSearch,
    setSearch,
    toggleShowInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";

const MixesFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);
    const inactive = useSelector(selectInactiveCount);
    const loading = useSelector(selectLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const showInactiveHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    const onClickNewColor = () => dispatch(loadMix());
    const onClickReload = () => dispatch(loadMixes());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={showInactive} onChange={showInactiveHandler}
                                      countInactive={inactive}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNewColor}>
                    New Mix
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
export default MixesFilter;
