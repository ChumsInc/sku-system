import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    loadCategoryList,
    selectListLoading,
    selectInactiveCount,
    selectSearch,
    selectShowInactive,
    setNewCategory,
    setSearch,
    toggleShowInactive
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";

const CategoriesFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const showInactive = useSelector(selectShowInactive);
    const inactive = useSelector(selectInactiveCount);
    const loading = useSelector(selectListLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearch(ev.target.value));
    const onClickFilterInactive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked));
    const onClickNew = () => dispatch(setNewCategory());
    const onClickReload = () => dispatch(loadCategoryList());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <ShowInactiveCheckbox checked={showInactive} onChange={onClickFilterInactive}
                                      countInactive={inactive}/>
            </div>
            <div className="col-auto">
                <input type="search" placeholder="Search" value={search} onChange={onChangeSearch}
                       className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNew}>
                    New Category
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
export default CategoriesFilter;
