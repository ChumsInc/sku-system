/**
 * Created by steve on 3/21/2017.
 */

import CategoriesFilter from "./CategoriesFilter";
import CategoriesList from "./CategoriesList";
import CategoriesEditor from "./CategoriesEditor";

const CategoriesTab = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-8">
                    <CategoriesFilter/>
                    <CategoriesList/>
                </div>
                <div className="col-4">
                    <CategoriesEditor />
                </div>
            </div>
        </div>
    )
}
export default CategoriesTab
