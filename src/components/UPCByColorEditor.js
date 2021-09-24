/**
 * Created by steve on 3/22/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../chums-components/Alert';
import FormControlGroup from '../chums-components/FormControlGroup';
import classNames from 'classnames';
import GTIN from '../GTIN';
import {connect} from 'react-redux';
import {updateColorUPC, saveColorUPC} from '../actions/colorUPC';
import FormGroupTextInput from "../chums-components/FormGroupTextInput";
import Select from '../chums-components/Select';
import FormGroup from "../chums-components/FormGroup";
import TextArea from "../chums-components/TextArea";


class UPCByColorEditor extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        company: PropTypes.string,
        ItemCode: PropTypes.string,
        ItemCodeDesc: PropTypes.string,
        upc: PropTypes.string,
        UDF_UPC: PropTypes.string,
        UDF_UPC_BY_COLOR: PropTypes.string,
        notes: PropTypes.string,
        changed: PropTypes.bool,
        isAdmin: PropTypes.bool,

        updateColorUPC: PropTypes.func.isRequired,
        saveColorUPC: PropTypes.func.isRequired,
    };
    
    static defaultProps = {
        id: 0,
        company: '',
        ItemCode: '',
        ItemCodeDesc: '',
        upc: '',
        UDF_UPC: '',
        UDF_UPC_BY_COLOR: '',
        notes: '',
        changed: false,
        isAdmin: false,
    };

    constructor(props) {
        super(props);

        this.onBlurUPC = this.onBlurUPC.bind(this);
        this.onClickUploadUPC = this.onClickUploadUPC.bind(this);
        this.onSaveSelected = this.onSaveSelected.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange({field, value}) {
        this.props.updateColorUPC(field, value);
    }

    onChangeSelected(field, value) {
        this.props.onChange(field, value);
    }

    onBlurUPC() {
        const {onChange, item} = this.props;
        onChange('upc', GTIN.formatUPC(item.upc).replace(/\S/g, ''))
    }

    onSaveSelected(ev) {
        const {onSave, item} = this.props;
        onSave(item);
    }

    onClickUploadUPC() {
        this.selected.UDF_UPC_BY_COLOR = this.selected.upc;
        this.selected.updateSageUPCByColor()
            .then(res => {
                console.log('onClickUploadUPC()', res);
            })
            .catch(err => {
                this.error = err.message;
            });
    }

    render() {
        const {upc, UDF_UPC, UDF_UPC_BY_COLOR, id, ItemCode, notes, company, isAdmin, changed} = this.props;
        
        let alerts = [];
        if (changed) {
            alerts.push(<Alert key="alert-changed" state='warning'>Don't forget to save your changes</Alert>);
        }

        // console.log('render check formatted upc', {is: formattedUPC, shouldbe: GTIN.formatUPC(formattedUPC.replace(/ /g, ''))});
        return (
            <div>
                <form className="form-horizontal" onSubmit={this.onSaveSelected}>
                    <h3>UPC By Color Editor</h3>
                    <div className="debug">
                        <FormControlGroup type="text" value={id} label="ID" colWidth={8} readOnly small/>
                    </div>
                    <FormGroup type="null" label="Company" colWidth={8} required small>
                        <Select value={company || ''} field="company" onChange={this.onChange}>
                            <option value="">Select Company</option>
                            <option value="chums">CHI - Chums Inc</option>
                            <option value="bc">BCS - Beyond Coastal</option>
                        </Select>
                    </FormGroup>
                    <FormGroupTextInput onChange={this.onChange} colWidth={8} label="Item" value={ItemCode} field="ItemCode"/>
                    <FormGroupTextInput onChange={this.onChange} colWidth={8} label="Color UPC"
                                        field="upc" value={GTIN.format(upc)}/>
                    <FormGroup colWidth={8} label="Notes">
                        <TextArea value={notes} field="notes" onChange={this.onChange}/>
                    </FormGroup>
                    <FormControlGroup type="null" colWidth={8} small className="mt-3">
                        <button type="button" disabled={!isAdmin} className="btn btn-primary"
                                onClick={this.props.saveColorUPC}>
                            Save
                        </button>
                    </FormControlGroup>
                    {alerts}
                    <div className="mt-3">
                        <h4>Sage UPCs</h4>
                        <FormGroupTextInput onChange={this.onChange} colWidth={8} label="UPC" value={GTIN.format(UDF_UPC)} readOnly/>
                        <FormGroupTextInput onChange={this.onChange} colWidth={8} label="Color UPC" value={GTIN.format(UDF_UPC_BY_COLOR)} readOnly/>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id, company, ItemCode, ItemCodeDesc, upc, notes, tags, ProductType, InactiveItem,
        UDF_UPC, UDF_UPC_BY_COLOR, active, changed  } = state.colorUPC.selected;
    const {isAdmin} = state.app;
    return { id, company, ItemCode, ItemCodeDesc, upc, notes, tags, ProductType, InactiveItem,
        UDF_UPC, UDF_UPC_BY_COLOR, active, changed, isAdmin };
};

const mapDispatchToProps = {
    updateColorUPC,
    saveColorUPC
};

export default connect(mapStateToProps, mapDispatchToProps)(UPCByColorEditor);
