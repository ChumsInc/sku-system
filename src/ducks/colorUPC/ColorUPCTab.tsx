/**
 * Created by steve on 3/21/2017.
 */

import ColorUPCFilter from "./ColorUPCFilter";
import ColorUPCList from "./ColorUPCList";
import ColorUPCEditor from "./ColorUPCEditor";

const ColorUPCTab = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-8">
                    <ColorUPCFilter/>
                    <ColorUPCList/>
                </div>
                <div className="col-4">
                    <ColorUPCEditor />
                </div>
            </div>
        </div>
    )
}
export default ColorUPCTab
