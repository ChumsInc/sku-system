import {BootstrapColor, SortableTableField} from "chums-components";
import {
    BaseSKU,
    CountryOfOrigin,
    PrimaryVendor,
    ProductCategory,
    ProductColor,
    ProductLine,
    ProductMixInfo,
    ProductSeason,
    ProductStatus,
    SKUGroup,
    Warehouse
} from "chums-types";


export interface Product {
    company: string,
    ItemCode: string,
    ItemCodeDesc: string,
    ProductLine: string,
    PriceCode: string | null,
    ProductType: string,
    Category4: string,
    InactiveItem: string,
    UDF_UPC: string | null,
    UDF_UPC_BY_COLOR: string | null,
    ItemStatus: string | null,
}

export type ProductField = keyof Product;

export interface ProductTableField extends SortableTableField {
    field: ProductField,
}

export interface ErrorAlert {
    id: number;
    context: string;
    message: string;
    count: number;
    color?: BootstrapColor;
}

export interface SettingsResponse {
    lines: ProductLine[];
    categories: ProductCategory[];
    subCategories: string[];
    skuList?: BaseSKU[];
    colors?: ProductColor[];
    mixes?: ProductMixInfo[],
    skuGroups?: SKUGroup[];
    countryOfOrigin?: CountryOfOrigin[];
    primaryVendor?: PrimaryVendor[];
    status?: ProductStatus[];
    seasons?: ProductSeason[];
    warehouses?: Warehouse[];
}
