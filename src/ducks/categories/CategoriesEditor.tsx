/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {saveCategory, selectCurrentCategory, selectLoading, selectSaving} from "./index";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import ProductLineSelect from "../../components/ProductLineSelect";
import {useAppDispatch} from "../../app/configureStore";
import {Editable, ProductCategory} from "chums-types";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {defaultCategory} from "../../api/categories";


const CategoriesEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCurrentCategory);
    const isSaving = useSelector(selectSaving)
    const isLoading = useSelector(selectLoading);
    const [category, setCategory] = useState<ProductCategory & Editable>(selected ?? {...defaultCategory});

    useEffect(() => {
        setCategory(selected ?? {...defaultCategory});
    }, [selected])

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => {
        const code = ev.target.value.toUpperCase();
        setCategory({...category, code, changed: category.changed || code !== selected?.code});
    }


    const onChange = (field: keyof ProductCategory) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = ev.target.value;
        const currentValue = !!selected ? (selected[field] ?? null) : null;

        setCategory({
            ...category,
            [field]: value,
            changed: category.changed || currentValue !== value,
        })
    }

    const onChangeActive = (active: boolean) => {
        setCategory({...category, active, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCategory(category));
    }

    // @TODO: add alert for duplicate category code
    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Category Editor</h3>
            <FormColumn label="Code">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">{category.id ?? 'NEW'}</div>
                    <input type="text" readOnly={!isAdmin} value={category.code}
                           className="form-control form-control-sm" minLength={2} maxLength={10}
                           onChange={onChangeCode}/>
                </div>
                <small className="text-muted">2-10 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={category.description ?? ''}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Product Line">
                <ProductLineSelect value={category.productLine ?? ''} onChange={onChange('productLine')}/>
            </FormColumn>
            <FormColumn label="Notes">
                <textarea readOnly={!isAdmin} value={category.notes ?? ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={category.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" color="primary" size="sm" spinning={isSaving} disabled={isSaving || isLoading}>Save</SpinnerButton>
            </FormColumn>
            {category.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default CategoriesEditor;
