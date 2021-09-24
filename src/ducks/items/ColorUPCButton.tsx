import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {assignNextColorUPCAction, selectAssigningItem} from "./index";
import {Product} from "../../types";
import GTIN from "../../GTIN";
import {SpinnerButton} from "chums-ducks";

export interface ColorUPCButtonProps {
    item: Product,
}

const ColorUPCButton:React.FC<ColorUPCButtonProps> = ({item}) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectAssigningItem(item.ItemCode));

    const clickHandler = () => {
        console.log(item);
        dispatch(assignNextColorUPCAction(item))
    }

    if (item.UDF_UPC_BY_COLOR) {
        return (
            <span>{GTIN.format(item.UDF_UPC_BY_COLOR)}</span>
        )
    }

    if (item.InactiveItem === 'Y' || item.ProductType === 'D') {
        return (<span className="bi-x-lg" />)
    }

    return (
        <SpinnerButton spinning={loading} color="outline-success" className="btn-xs"
                       onClick={clickHandler}>
            {!loading && (<span className="bi-gear-fill"/>)}
        </SpinnerButton>
    )
}
export default ColorUPCButton;
