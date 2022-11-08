import {ColorUPC, ColorUPCSorterProps} from "../../types";

export const defaultColorUPCSort: ColorUPCSorterProps = {
    field: "upc",
    ascending: true,
}

export const colorUPCKey = (color: ColorUPC) => color.upc;

export const colorUPCSorter = ({field, ascending}: ColorUPCSorterProps) =>
    (a: ColorUPC, b: ColorUPC) => {
        if (field === 'tags') {
            return 0;
        }
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return (
            aVal === bVal
                ? (colorUPCKey(a) > colorUPCKey(b) ? 1 : -1)
                : (aVal > bVal ? 1 : -1)
        ) * (ascending ? 1 : -1);
    }


export const calcCheckDigit = (gtin:string):string => {
    console.log('calcCheckDigit', gtin);
    if (/^45[0-9]/.test(gtin)) {
        if (gtin.length < 13) {
            return gtin;
        }
        if (gtin.length > 13) {
            gtin = gtin.substring(0, 13);
        }
        return gtin + checkDigit(gtin);
    }
    if (gtin.length < 11) {
        return gtin;
    }
    if (gtin.length > 12) {
        gtin = gtin.substring(0, 11);
    }
    return gtin + checkDigit(gtin);
}


const checkDigit = (gtin:string):string => {
    let cd = {
        even: 0,
        odd: 0
    };
    gtin.split('').reverse().map((c, index) => {
        let parsed = parseInt(c, 10);
        if (index % 2 === 0) {
            cd.even += parsed;
        } else {
            cd.odd += parsed;
        }
    });
    cd.even *= 3;
    return ((10 - (cd.odd + cd.even) % 10) % 10).toString();
}
