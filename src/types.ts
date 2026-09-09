import type {
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
