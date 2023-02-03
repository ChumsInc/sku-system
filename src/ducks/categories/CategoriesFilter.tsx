import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {
    categoriesToggleFilterInactive,
    loadCategoryList,
    selectActiveCategoriesCount,
    selectCategoriesCount,
    selectFilterInactive,
    selectCategoryListLoading,
    selectSearch,
    setCategoriesSearch,
    setNewCategory
} from "./index";
import {SpinnerButton} from "chums-components";
import ShowInactiveCheckbox from "../../components/ShowInactiveCheckbox";
import {useAppDispatch} from "../../app/configureStore";

const CategoriesFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectSearch);
    const filterInactive = useSelector(selectFilterInactive);
    const categoriesCount = useSelector(selectCategoriesCount);
    const activeCategoriesCount = useSelector(selectActiveCategoriesCount);
    const loading = useSelector(selectCategoryListLoading);

    const onChangeSearch = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setCategoriesSearch(ev.target.value));
    const onClickFilterInactive = () => dispatch(categoriesToggleFilterInactive());
    const onClickNew = () => dispatch(setNewCategory());
    const onClickReload = () => dispatch(loadCategoryList());

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
