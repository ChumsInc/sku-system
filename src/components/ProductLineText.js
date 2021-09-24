import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class ProductLineText extends Component {
    static propTypes = {
        productLines: PropTypes.arrayOf(PropTypes.shape({
            ProductLine: PropTypes.string,
            ProductLineDesc: PropTypes.string,
            active: PropTypes.bool,
        })),
        productLineCode: PropTypes.string
    };

    static defaultProps = {
        lines: [],
        productLine: {},
    };

    render() {
        const {productLineCode, productLines} = this.props;
        if (!productLineCode) {
            return null;
        }
        const [productLine] =  productLines.filter(pl => pl.ProductLine === productLineCode);
        if (!productLine) {
            return (<Fragment>({productLineCode})</Fragment>)
        }
        return (
            <Fragment>{productLine.ProductLineDesc} ({productLine.ProductLine})</Fragment>
        )
    }
}

const mapStateToProps = ({settings}) => {
    const {lines} = settings;
    return {productLines: lines};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductLineText) 
