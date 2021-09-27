/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {categoryChangedAction, saveCategoryAction, selectCategory} from "./index";
import {CategoryField} from "../../types";
import {Alert, FormColumn} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import ProductLineSelect from "../../components/ProductLineSelect";


const CategoriesEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCategory);

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => dispatch(categoryChangedAction('code', ev.target.value.toUpperCase()));


    const onChange = (field: CategoryField) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch(categoryChangedAction(field, ev.target.value));
    }

    const onChangeActive = () => dispatch(categoryChangedAction('active', !selected.active));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCategoryAction(selected));
    }

    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Category Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={selected.code}
                       className="form-control form-control-sm" minLength={2} maxLength={10}
                       onChange={onChangeCode}/>
                <small className="text-muted">2-10 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={selected.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Product Line">
                <ProductLineSelect value={selected.productLine} onChange={onChange('productLine')}/>
            </FormColumn>
            <FormColumn label="Notes">
                <textarea readOnly={!isAdmin} value={selected.notes || ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={selected.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <button type="submit" className="btn btn-sm btn-primary">Save</button>
            </FormColumn>
            {selected.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default CategoriesEditor;
