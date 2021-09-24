import {SortableTableField, SorterProps} from "chums-ducks";


export interface ProductLine {
    ProductLine: string,
    ProductLineDesc: string,
    Valuation: string,
    ExplodedKitItems: string,
    active: boolean,
}
export interface ProductLineList {
    [key:string]: ProductLine,
}

export interface ProductCategory {
    Category2: string,
    id: number,
    code: string,
    description: string,
    active: boolean,
    notes: string,
    tags: unknown,
    productLine: string,
}
export interface ProductCategoryList {
    [key:string]: ProductCategory,
}

export type ProductSubCategory = string;

export interface ProductSKU {
    Category4?: string,
    id: number,
    sku_group_id: number,
    sku: string,
    description: string,
    upc: string,
    active: boolean,
    notes: string|null,
    // tags: unknown,
    changed?: boolean,
}
export interface ProductSKUList {
    [key: number]: ProductSKU,
}
export type ProductSKUField = keyof ProductSKU;
export interface ProductSKUTableField extends SortableTableField {
    field: ProductSKUField
}
export interface ProductSKUSorterProps extends SorterProps {
    field: ProductSKUField,
}

export interface ProductColor {
    id: number,
    code: string,
    description: string,
    active: boolean,
    notes: string|null,
    tags: unknown,
    changed?: boolean,
}
export type ProductColorField = keyof ProductColor;
export interface ProductColorTableField extends SortableTableField {
    field: ProductColorField,
}
export interface ProductColorSorterProps extends SorterProps {
    field: ProductColorField
}


export interface ProductMix {
    id: number,
    code: string,
    description: string,
    active: boolean,
    notes: string|null,
    tags: unknown,
}
export type ProductMixField = keyof ProductMix;
export interface ProductMixTableField extends SortableTableField {
    field: ProductMixField,
}
export interface ProductMixSorterProps extends SorterProps {
    field: ProductMixField
}

export interface ColorUPC {
    company: string,
    id: number,
    ItemCode: string,
    ItemCodeDesc: string,
    upc: string
    notes: string|null
    tags: unknown,
    ProductType: string,
    InactiveItem: string,
    UDF_UPC: string,
    UDF_UPC_BY_COLOR: string
    active: boolean
}
export type ColorUPCField = keyof ColorUPC;
export interface ColorUPCTableField extends SortableTableField {
    field: ColorUPCField,
}
export interface ColorUPCSorterProps extends SorterProps {
    field: ColorUPCField
}

export interface CountryOfOrigin {
    countryOfOrigin: string,
}

export interface PrimaryVendor {
    PrimaryVendorNo: string,
    VendorName: string,
}

export interface PrimaryVendorList {
    [key:string]: PrimaryVendor,
}

export interface ProductStatus {
    id: number,
    code: string,
    description: string,
}

export interface ProductSeason {
    id: number,
    code: string,
    description: string,
    properties: {
        color: string,
    },
    notes: string,
    active: boolean,
    userId: number,
}

export interface ProductWarehouse {
    WarehouseCode: string,
    WarehouseDesc: string,
    WarehouseStatus: string,
}

export interface SKUGroup {
    id: number,
    code: string,
    description: string,
    active: boolean,
    notes: string|null,
    tags: unknown,
    productLine: string,
}
export type SKUGroupField = keyof SKUGroup;
export interface SKUGroupTableField {
    field: SKUGroupField,
}
export interface SKUGroupSorterProps extends SorterProps {
    field: SKUGroupField
}

export interface Product {
    company: string,
    ItemCode: string,
    ItemCodeDesc: string,
    ProductLine: string,
    PriceCode: string|null,
    ProductType: string,
    Category4: string,
    InactiveItem: string,
    UDF_UPC: string|null,
    UDF_UPC_BY_COLOR: string|null,
    ItemStatus: string|null,
}
export type ProductField = keyof Product;
export interface ProductTableField extends SortableTableField {
    field: ProductField,
}
export interface ProductSorterProps extends SorterProps {
    field: ProductField
}
