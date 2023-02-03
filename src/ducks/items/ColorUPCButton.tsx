import React from "react";
import {useSelector} from "react-redux";
import {assignNextColorUPCAction, selectAssigningItems} from "./index";
import {Product} from "../../types";
import {SpinnerButton} from "chums-components";
import {useAppDispatch} from "../../app/configureStore";
import {formatGTIN} from "@chumsinc/gtin-tools";

export interface ColorUPCButtonProps {
    item: Product,
}

export default function ColorUPCButton({item}: ColorUPCButtonProps) {
    const dispatch = useAppDispatch();
    const assigning = useSelector(selectAssigningItems);

    const clickHandler = () => {
        console.log(item);
        dispatch(assignNextColorUPCAction(item))
    }

    if (item.UDF_UPC_BY_COLOR) {
        return (
            <span>{formatGTIN(item.UDF_UPC_BY_COLOR)}</span>
        )
    }

    if (item.InactiveItem === 'Y' || item.ProductType === 'D') {
        return (<span className="bi-x-lg"/>)
    }

    return (
        <SpinnerButton spinning={assigning.includes(item.ItemCode)} color="outline-success" className="btn-xs"
                       onClick={clickHandler}>
            {!assigning.includes(item.ItemCode) && (<span className="bi-gear-fill"/>)}
        </SpinnerButton>
    )
}
