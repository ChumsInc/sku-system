import React, { Component } from 'react';
import {sortProductLinesByDesc} from "../utils";
import PropTypes from 'prop-types';

export const ProductLineOptions = ({productLines, showInactive = false}) => {
    return productLines
        .sort(sortProductLinesByDesc)
        .filter(pl => showInactive || pl.active)
        .map(pl => (
            <option key={pl.ProductLine} value={pl.ProductLine}>{pl.ProductLineDesc || ''} ({pl.ProductLine})</option>
        ));
};
ProductLineOptions.propTypes = {
    productLines: PropTypes.arrayOf(PropTypes.shape({
        ProductLine: PropTypes.string.isRequired,
        ProductLineDesc: PropTypes.string,
        active: PropTypes.bool,
    })),
    showInactive: PropTypes.bool,
};
