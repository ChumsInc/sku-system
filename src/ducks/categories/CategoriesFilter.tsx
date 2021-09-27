import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    defaultCategory,
    fetchCategoryAction,
    fetchListAction,
    filterInactiveChangedAction,
    searchChangedAction,
    selectActiveCategoriesCount,
    selectCategoriesCount,
    selectFilterInactive,
    selectLoading,
    selectSearch
} from "./index";
import {SpinnerButton} from "chums-ducks";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";

const CategoriesFilter: React.FC = () => {
    const dispatch = useDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const categoriesCount = useSelector(selectCategoriesCount);
    const activeCategoriesCount = useSelector(selectActiveCategoriesCount);
    const loading = useSelector(selectLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(searchChangedAction(ev.target.value));
    const onClickFilterInactive = () => dispatch(filterInactiveChangedAction());
    const onClickNew = () => dispatch(fetchCategoryAction(defaultCategory));
    const onClickReload = () => dispatch(fetchListAction());

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
