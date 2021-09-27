/**
 * Created by steve on 3/22/2017.
 */
"use strict";


export const sortProductLinesByDesc = (a, b) => a.ProductLineDesc === b.ProductLineDesc
    ? 0
    : (a.ProductLineDesc > b.ProductLineDesc ? 1 : -1);

export const getClassName = (className, val) => {
    switch (typeof className) {
    case 'function':
        const _className = className(val);
        if (typeof _className === 'object') {
            return {
                ..._className,
            };
        }
        return {[_className]: true};
    case 'object':
        return {...className};
    default:
        return {[className]: true};
    }
};

export const noop = () => {};
