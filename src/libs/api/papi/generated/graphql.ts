/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
  UUID: { input: any; output: any };
};

export type AddProductPartInput = {
  notes?: InputMaybe<Scalars["String"]["input"]>;
  partId: Scalars["UUID"]["input"];
  productId: Scalars["UUID"]["input"];
  quantity: Scalars["Int"]["input"];
};

export type Category = {
  __typename?: "Category";
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
};

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type CreateManufacturerInput = {
  countryOfOrigin?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type CreatePartInput = {
  categoryIds: Array<Scalars["UUID"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  images: Array<Scalars["String"]["input"]>;
  manufacturerId: Scalars["UUID"]["input"];
  name: Scalars["String"]["input"];
  partNumber: Scalars["String"]["input"];
  specifications?: InputMaybe<Scalars["JSON"]["input"]>;
  temperatureStage?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePartsInventoryInput = {
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  partId: Scalars["UUID"]["input"];
  serialNumber: Scalars["String"]["input"];
};

export type CreateProductInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateProductInventoryInput = {
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  productId: Scalars["UUID"]["input"];
  serialNumber: Scalars["String"]["input"];
};

export type GenerateUploadUrlInput = {
  contentType: Scalars["String"]["input"];
};

export type Manufacturer = {
  __typename?: "Manufacturer";
  countryOfOrigin?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  addPartToProductInventory: Scalars["Boolean"]["output"];
  addProductPart: ProductPart;
  createCategory: Category;
  createManufacturer: Manufacturer;
  createPart: Part;
  createPartsInventory: PartsInventory;
  createProduct: Product;
  createProductInventory: ProductInventory;
  deleteCategory: Scalars["Boolean"]["output"];
  deleteManufacturer: Scalars["Boolean"]["output"];
  deletePart: Scalars["Boolean"]["output"];
  deletePartsInventory: Scalars["Boolean"]["output"];
  deleteProduct: Scalars["Boolean"]["output"];
  deleteProductInventory: Scalars["Boolean"]["output"];
  optimize3D: Optimize3DResponse;
  removePartFromProductInventory: Scalars["Boolean"]["output"];
  removeProductPart: Scalars["Boolean"]["output"];
  updateCategory: Category;
  updateManufacturer: Manufacturer;
  updatePart: Part;
  updatePartsInventory: PartsInventory;
  updateProduct: Product;
  updateProductInventory: ProductInventory;
  updateProductPart: ProductPart;
};

export type MutationAddPartToProductInventoryArgs = {
  partsInventoryId: Scalars["UUID"]["input"];
  productInventoryId: Scalars["UUID"]["input"];
};

export type MutationAddProductPartArgs = {
  input: AddProductPartInput;
};

export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

export type MutationCreateManufacturerArgs = {
  input: CreateManufacturerInput;
};

export type MutationCreatePartArgs = {
  input: CreatePartInput;
};

export type MutationCreatePartsInventoryArgs = {
  input: CreatePartsInventoryInput;
};

export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

export type MutationCreateProductInventoryArgs = {
  input: CreateProductInventoryInput;
};

export type MutationDeleteCategoryArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteManufacturerArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeletePartArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeletePartsInventoryArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteProductArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteProductInventoryArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationOptimize3DArgs = {
  input: Optimize3DInput;
};

export type MutationRemovePartFromProductInventoryArgs = {
  partsInventoryId: Scalars["UUID"]["input"];
  productInventoryId: Scalars["UUID"]["input"];
};

export type MutationRemoveProductPartArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationUpdateCategoryArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateCategoryInput;
};

export type MutationUpdateManufacturerArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateManufacturerInput;
};

export type MutationUpdatePartArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdatePartInput;
};

export type MutationUpdatePartsInventoryArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdatePartsInventoryInput;
};

export type MutationUpdateProductArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateProductInput;
};

export type MutationUpdateProductInventoryArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateProductInventoryInput;
};

export type MutationUpdateProductPartArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdateProductPartInput;
};

export type Optimize3DInput = {
  dracoCompressionLevel?: InputMaybe<Scalars["Int"]["input"]>;
  dracoGenericQuantization?: InputMaybe<Scalars["Int"]["input"]>;
  dracoNormalQuantization?: InputMaybe<Scalars["Int"]["input"]>;
  dracoPositionQuantization?: InputMaybe<Scalars["Int"]["input"]>;
  dracoTexcoordQuantization?: InputMaybe<Scalars["Int"]["input"]>;
  sourceURL: Scalars["String"]["input"];
};

export type Optimize3DResponse = {
  __typename?: "Optimize3DResponse";
  jobID: Scalars["UUID"]["output"];
  status: Scalars["String"]["output"];
};

export type Part = {
  __typename?: "Part";
  categories?: Maybe<Array<Category>>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  images: Array<Scalars["String"]["output"]>;
  manufacturer?: Maybe<Manufacturer>;
  manufacturerId: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
  partNumber: Scalars["String"]["output"];
  specifications?: Maybe<Scalars["JSON"]["output"]>;
  temperatureStage?: Maybe<Scalars["String"]["output"]>;
};

export type Part3DModelResult = {
  __typename?: "Part3DModelResult";
  downloadURL?: Maybe<Scalars["String"]["output"]>;
  jobID: Scalars["UUID"]["output"];
  status: Scalars["String"]["output"];
};

export type PartsInventory = {
  __typename?: "PartsInventory";
  id: Scalars["UUID"]["output"];
  isAvailable: Scalars["Boolean"]["output"];
  notes?: Maybe<Scalars["String"]["output"]>;
  part?: Maybe<Part>;
  partId: Scalars["UUID"]["output"];
  serialNumber: Scalars["String"]["output"];
};

export type Product = {
  __typename?: "Product";
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
  parts?: Maybe<Array<ProductPart>>;
  version?: Maybe<Scalars["String"]["output"]>;
};

export type ProductInventory = {
  __typename?: "ProductInventory";
  id: Scalars["UUID"]["output"];
  isAvailable: Scalars["Boolean"]["output"];
  notes?: Maybe<Scalars["String"]["output"]>;
  partsUsed?: Maybe<Array<PartsInventory>>;
  product?: Maybe<Product>;
  productId: Scalars["UUID"]["output"];
  serialNumber: Scalars["String"]["output"];
};

export type ProductPart = {
  __typename?: "ProductPart";
  id: Scalars["UUID"]["output"];
  notes?: Maybe<Scalars["String"]["output"]>;
  part?: Maybe<Part>;
  partId: Scalars["UUID"]["output"];
  productId: Scalars["UUID"]["output"];
  quantity: Scalars["Int"]["output"];
};

export type Query = {
  __typename?: "Query";
  categories: Array<Category>;
  category?: Maybe<Category>;
  generateUploadURL: UploadUrlResponse;
  getPart3DModel?: Maybe<Part3DModelResult>;
  manufacturer?: Maybe<Manufacturer>;
  manufacturers: Array<Manufacturer>;
  part?: Maybe<Part>;
  parts: Array<Part>;
  partsInventory: Array<PartsInventory>;
  partsInventoryByPart: Array<PartsInventory>;
  partsInventoryItem?: Maybe<PartsInventory>;
  product?: Maybe<Product>;
  productInventory: Array<ProductInventory>;
  productInventoryByProduct: Array<ProductInventory>;
  productInventoryItem?: Maybe<ProductInventory>;
  products: Array<Product>;
  searchParts: Array<Part>;
  searchProducts: Array<Product>;
};

export type QueryCategoryArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryGenerateUploadUrlArgs = {
  input: GenerateUploadUrlInput;
};

export type QueryGetPart3DModelArgs = {
  jobID: Scalars["UUID"]["input"];
};

export type QueryManufacturerArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryPartArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryPartsInventoryByPartArgs = {
  partId: Scalars["UUID"]["input"];
};

export type QueryPartsInventoryItemArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryProductArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryProductInventoryByProductArgs = {
  productId: Scalars["UUID"]["input"];
};

export type QueryProductInventoryItemArgs = {
  id: Scalars["UUID"]["input"];
};

export type QuerySearchPartsArgs = {
  name: Scalars["String"]["input"];
};

export type QuerySearchProductsArgs = {
  name: Scalars["String"]["input"];
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateManufacturerInput = {
  countryOfOrigin?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdatePartInput = {
  categoryIds?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  specifications?: InputMaybe<Scalars["JSON"]["input"]>;
  temperatureStage?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdatePartsInventoryInput = {
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  serialNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProductInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProductInventoryInput = {
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  serialNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProductPartInput = {
  notes?: InputMaybe<Scalars["String"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UploadUrlResponse = {
  __typename?: "UploadURLResponse";
  fileKey: Scalars["String"]["output"];
  uploadURL: Scalars["String"]["output"];
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCategoriesQuery = {
  __typename?: "Query";
  categories: Array<{
    __typename?: "Category";
    id: any;
    name: string;
    description?: string | null;
  }>;
};

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
  __typename?: "Mutation";
  createCategory: {
    __typename?: "Category";
    id: any;
    name: string;
    description?: string | null;
  };
};

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateCategoryInput;
}>;

export type UpdateCategoryMutation = {
  __typename?: "Mutation";
  updateCategory: {
    __typename?: "Category";
    id: any;
    name: string;
    description?: string | null;
  };
};

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeleteCategoryMutation = {
  __typename?: "Mutation";
  deleteCategory: boolean;
};

export type GetManufacturersQueryVariables = Exact<{ [key: string]: never }>;

export type GetManufacturersQuery = {
  __typename?: "Query";
  manufacturers: Array<{
    __typename?: "Manufacturer";
    id: any;
    name: string;
    countryOfOrigin?: string | null;
  }>;
};

export type GetManufacturerQueryVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type GetManufacturerQuery = {
  __typename?: "Query";
  manufacturer?: {
    __typename?: "Manufacturer";
    id: any;
    name: string;
    countryOfOrigin?: string | null;
  } | null;
};

export type CreateManufacturerMutationVariables = Exact<{
  input: CreateManufacturerInput;
}>;

export type CreateManufacturerMutation = {
  __typename?: "Mutation";
  createManufacturer: {
    __typename?: "Manufacturer";
    id: any;
    name: string;
    countryOfOrigin?: string | null;
  };
};

export type UpdateManufacturerMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateManufacturerInput;
}>;

export type UpdateManufacturerMutation = {
  __typename?: "Mutation";
  updateManufacturer: {
    __typename?: "Manufacturer";
    id: any;
    name: string;
    countryOfOrigin?: string | null;
  };
};

export type DeleteManufacturerMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeleteManufacturerMutation = {
  __typename?: "Mutation";
  deleteManufacturer: boolean;
};

export type GetPartsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPartsQuery = {
  __typename?: "Query";
  parts: Array<{
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    images: Array<string>;
    manufacturerId: any;
    specifications?: any | null;
    temperatureStage?: string | null;
    manufacturer?: {
      __typename?: "Manufacturer";
      id: any;
      name: string;
      countryOfOrigin?: string | null;
    } | null;
    categories?: Array<{
      __typename?: "Category";
      id: any;
      name: string;
      description?: string | null;
    }> | null;
  }>;
};

export type GetPartQueryVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type GetPartQuery = {
  __typename?: "Query";
  part?: {
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    images: Array<string>;
    manufacturerId: any;
    specifications?: any | null;
    temperatureStage?: string | null;
    manufacturer?: {
      __typename?: "Manufacturer";
      id: any;
      name: string;
      countryOfOrigin?: string | null;
    } | null;
    categories?: Array<{
      __typename?: "Category";
      id: any;
      name: string;
      description?: string | null;
    }> | null;
  } | null;
};

export type GetPartsInventoryQueryVariables = Exact<{ [key: string]: never }>;

export type GetPartsInventoryQuery = {
  __typename?: "Query";
  partsInventory: Array<{
    __typename?: "PartsInventory";
    id: any;
    partId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
    part?: {
      __typename?: "Part";
      id: any;
      name: string;
      partNumber: string;
    } | null;
  }>;
};

export type GetPartsInventoryByPartQueryVariables = Exact<{
  partId: Scalars["UUID"]["input"];
}>;

export type GetPartsInventoryByPartQuery = {
  __typename?: "Query";
  partsInventoryByPart: Array<{
    __typename?: "PartsInventory";
    id: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
  }>;
};

export type GetPartsInventoryItemQueryVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type GetPartsInventoryItemQuery = {
  __typename?: "Query";
  partsInventoryItem?: {
    __typename?: "PartsInventory";
    id: any;
    partId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
    part?: {
      __typename?: "Part";
      id: any;
      name: string;
      partNumber: string;
    } | null;
  } | null;
};

export type CreatePartsInventoryMutationVariables = Exact<{
  input: CreatePartsInventoryInput;
}>;

export type CreatePartsInventoryMutation = {
  __typename?: "Mutation";
  createPartsInventory: {
    __typename?: "PartsInventory";
    id: any;
    partId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
  };
};

export type UpdatePartsInventoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdatePartsInventoryInput;
}>;

export type UpdatePartsInventoryMutation = {
  __typename?: "Mutation";
  updatePartsInventory: {
    __typename?: "PartsInventory";
    id: any;
    partId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
  };
};

export type DeletePartsInventoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeletePartsInventoryMutation = {
  __typename?: "Mutation";
  deletePartsInventory: boolean;
};

export type CreatePartMutationVariables = Exact<{
  input: CreatePartInput;
}>;

export type CreatePartMutation = {
  __typename?: "Mutation";
  createPart: {
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    images: Array<string>;
    manufacturerId: any;
    specifications?: any | null;
    temperatureStage?: string | null;
  };
};

export type UpdatePartMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdatePartInput;
}>;

export type UpdatePartMutation = {
  __typename?: "Mutation";
  updatePart: {
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    images: Array<string>;
    manufacturerId: any;
    specifications?: any | null;
    temperatureStage?: string | null;
  };
};

export type DeletePartMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeletePartMutation = {
  __typename?: "Mutation";
  deletePart: boolean;
};

export type GetProductsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProductsQuery = {
  __typename?: "Query";
  products: Array<{
    __typename?: "Product";
    id: any;
    name: string;
    description?: string | null;
    version?: string | null;
    parts?: Array<{
      __typename?: "ProductPart";
      id: any;
      partId: any;
      quantity: number;
      notes?: string | null;
      part?: {
        __typename?: "Part";
        id: any;
        name: string;
        partNumber: string;
      } | null;
    }> | null;
  }>;
};

export type GetProductQueryVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type GetProductQuery = {
  __typename?: "Query";
  product?: {
    __typename?: "Product";
    id: any;
    name: string;
    description?: string | null;
    version?: string | null;
    parts?: Array<{
      __typename?: "ProductPart";
      id: any;
      partId: any;
      quantity: number;
      notes?: string | null;
      part?: {
        __typename?: "Part";
        id: any;
        name: string;
        partNumber: string;
      } | null;
    }> | null;
  } | null;
};

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;

export type CreateProductMutation = {
  __typename?: "Mutation";
  createProduct: {
    __typename?: "Product";
    id: any;
    name: string;
    description?: string | null;
    version?: string | null;
  };
};

export type AddProductPartMutationVariables = Exact<{
  input: AddProductPartInput;
}>;

export type AddProductPartMutation = {
  __typename?: "Mutation";
  addProductPart: {
    __typename?: "ProductPart";
    id: any;
    productId: any;
    partId: any;
    quantity: number;
    notes?: string | null;
  };
};

export type RemoveProductPartMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type RemoveProductPartMutation = {
  __typename?: "Mutation";
  removeProductPart: boolean;
};

export type UpdateProductMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateProductInput;
}>;

export type UpdateProductMutation = {
  __typename?: "Mutation";
  updateProduct: {
    __typename?: "Product";
    id: any;
    name: string;
    description?: string | null;
    version?: string | null;
  };
};

export type DeleteProductMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeleteProductMutation = {
  __typename?: "Mutation";
  deleteProduct: boolean;
};

export type GetProductInventoryQueryVariables = Exact<{ [key: string]: never }>;

export type GetProductInventoryQuery = {
  __typename?: "Query";
  productInventory: Array<{
    __typename?: "ProductInventory";
    id: any;
    productId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
    product?: {
      __typename?: "Product";
      id: any;
      name: string;
      version?: string | null;
    } | null;
    partsUsed?: Array<{
      __typename?: "PartsInventory";
      id: any;
      partId: any;
      serialNumber: string;
      isAvailable: boolean;
      part?: {
        __typename?: "Part";
        id: any;
        name: string;
        partNumber: string;
      } | null;
    }> | null;
  }>;
};

export type GetProductInventoryByProductQueryVariables = Exact<{
  productId: Scalars["UUID"]["input"];
}>;

export type GetProductInventoryByProductQuery = {
  __typename?: "Query";
  productInventoryByProduct: Array<{
    __typename?: "ProductInventory";
    id: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
    partsUsed?: Array<{
      __typename?: "PartsInventory";
      id: any;
      partId: any;
      serialNumber: string;
      isAvailable: boolean;
      part?: {
        __typename?: "Part";
        id: any;
        name: string;
        partNumber: string;
      } | null;
    }> | null;
  }>;
};

export type GetProductInventoryItemQueryVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type GetProductInventoryItemQuery = {
  __typename?: "Query";
  productInventoryItem?: {
    __typename?: "ProductInventory";
    id: any;
    productId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
    product?: {
      __typename?: "Product";
      id: any;
      name: string;
      version?: string | null;
    } | null;
    partsUsed?: Array<{
      __typename?: "PartsInventory";
      id: any;
      partId: any;
      serialNumber: string;
      isAvailable: boolean;
      part?: {
        __typename?: "Part";
        id: any;
        name: string;
        partNumber: string;
      } | null;
    }> | null;
  } | null;
};

export type CreateProductInventoryMutationVariables = Exact<{
  input: CreateProductInventoryInput;
}>;

export type CreateProductInventoryMutation = {
  __typename?: "Mutation";
  createProductInventory: {
    __typename?: "ProductInventory";
    id: any;
    productId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
  };
};

export type UpdateProductInventoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
  input: UpdateProductInventoryInput;
}>;

export type UpdateProductInventoryMutation = {
  __typename?: "Mutation";
  updateProductInventory: {
    __typename?: "ProductInventory";
    id: any;
    productId: any;
    serialNumber: string;
    isAvailable: boolean;
    notes?: string | null;
  };
};

export type DeleteProductInventoryMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeleteProductInventoryMutation = {
  __typename?: "Mutation";
  deleteProductInventory: boolean;
};

export type AddPartToProductInventoryMutationVariables = Exact<{
  partsInventoryId: Scalars["UUID"]["input"];
  productInventoryId: Scalars["UUID"]["input"];
}>;

export type AddPartToProductInventoryMutation = {
  __typename?: "Mutation";
  addPartToProductInventory: boolean;
};

export type RemovePartFromProductInventoryMutationVariables = Exact<{
  partsInventoryId: Scalars["UUID"]["input"];
  productInventoryId: Scalars["UUID"]["input"];
}>;

export type RemovePartFromProductInventoryMutation = {
  __typename?: "Mutation";
  removePartFromProductInventory: boolean;
};

export const GetCategoriesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetCategories" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "categories" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CreateCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateCategoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createCategory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>;
export const UpdateCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateCategoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateCategory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>;
export const DeleteCategoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteCategory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteCategory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables
>;
export const GetManufacturersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetManufacturers" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "manufacturers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "countryOfOrigin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetManufacturersQuery,
  GetManufacturersQueryVariables
>;
export const GetManufacturerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetManufacturer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "manufacturer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "countryOfOrigin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetManufacturerQuery,
  GetManufacturerQueryVariables
>;
export const CreateManufacturerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateManufacturer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateManufacturerInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createManufacturer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "countryOfOrigin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateManufacturerMutation,
  CreateManufacturerMutationVariables
>;
export const UpdateManufacturerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateManufacturer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateManufacturerInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateManufacturer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "countryOfOrigin" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateManufacturerMutation,
  UpdateManufacturerMutationVariables
>;
export const DeleteManufacturerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteManufacturer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteManufacturer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteManufacturerMutation,
  DeleteManufacturerMutationVariables
>;
export const GetPartsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetParts" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "parts" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "partNumber" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "specifications" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "countryOfOrigin" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "categories" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPartsQuery, GetPartsQueryVariables>;
export const GetPartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "part" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "partNumber" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "specifications" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "countryOfOrigin" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "categories" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPartQuery, GetPartQueryVariables>;
export const GetPartsInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPartsInventory" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "partsInventory" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "partId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "part" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partNumber" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPartsInventoryQuery,
  GetPartsInventoryQueryVariables
>;
export const GetPartsInventoryByPartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPartsInventoryByPart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "partId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "partsInventoryByPart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "partId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "partId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPartsInventoryByPartQuery,
  GetPartsInventoryByPartQueryVariables
>;
export const GetPartsInventoryItemDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPartsInventoryItem" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "partsInventoryItem" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "partId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "part" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partNumber" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPartsInventoryItemQuery,
  GetPartsInventoryItemQueryVariables
>;
export const CreatePartsInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePartsInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreatePartsInventoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPartsInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "partId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePartsInventoryMutation,
  CreatePartsInventoryMutationVariables
>;
export const UpdatePartsInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePartsInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdatePartsInventoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePartsInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "partId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePartsInventoryMutation,
  UpdatePartsInventoryMutationVariables
>;
export const DeletePartsInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeletePartsInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deletePartsInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeletePartsInventoryMutation,
  DeletePartsInventoryMutationVariables
>;
export const CreatePartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreatePartInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "partNumber" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "specifications" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreatePartMutation, CreatePartMutationVariables>;
export const UpdatePartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdatePartInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "partNumber" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "specifications" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdatePartMutation, UpdatePartMutationVariables>;
export const DeletePartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeletePart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deletePart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeletePartMutation, DeletePartMutationVariables>;
export const GetProductsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProducts" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "products" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "version" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quantity" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "notes" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "part" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "partNumber" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProductsQuery, GetProductsQueryVariables>;
export const GetProductDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProduct" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "product" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "version" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parts" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quantity" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "notes" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "part" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "partNumber" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProductQuery, GetProductQueryVariables>;
export const CreateProductDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateProduct" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateProductInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createProduct" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export const AddProductPartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProductPart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "AddProductPartInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addProductPart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "productId" } },
                { kind: "Field", name: { kind: "Name", value: "partId" } },
                { kind: "Field", name: { kind: "Name", value: "quantity" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProductPartMutation,
  AddProductPartMutationVariables
>;
export const RemoveProductPartDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveProductPart" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeProductPart" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveProductPartMutation,
  RemoveProductPartMutationVariables
>;
export const UpdateProductDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProduct" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateProductInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProduct" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "version" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const DeleteProductDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProduct" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProduct" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export const GetProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProductInventory" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "productInventory" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "productId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "product" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "version" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "partsUsed" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "serialNumber" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isAvailable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "part" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "partNumber" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProductInventoryQuery,
  GetProductInventoryQueryVariables
>;
export const GetProductInventoryByProductDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProductInventoryByProduct" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "productId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "productInventoryByProduct" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "productId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "productId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "partsUsed" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "serialNumber" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isAvailable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "part" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "partNumber" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProductInventoryByProductQuery,
  GetProductInventoryByProductQueryVariables
>;
export const GetProductInventoryItemDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProductInventoryItem" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "productInventoryItem" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "productId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "product" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "version" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "partsUsed" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "partId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "serialNumber" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isAvailable" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "part" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "partNumber" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProductInventoryItemQuery,
  GetProductInventoryItemQueryVariables
>;
export const CreateProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateProductInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateProductInventoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createProductInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "productId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateProductInventoryMutation,
  CreateProductInventoryMutationVariables
>;
export const UpdateProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProductInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdateProductInventoryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateProductInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "productId" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "serialNumber" },
                },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProductInventoryMutation,
  UpdateProductInventoryMutationVariables
>;
export const DeleteProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProductInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteProductInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProductInventoryMutation,
  DeleteProductInventoryMutationVariables
>;
export const AddPartToProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddPartToProductInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "partsInventoryId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "productInventoryId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addPartToProductInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "partsInventoryId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "partsInventoryId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "productInventoryId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "productInventoryId" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddPartToProductInventoryMutation,
  AddPartToProductInventoryMutationVariables
>;
export const RemovePartFromProductInventoryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemovePartFromProductInventory" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "partsInventoryId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "productInventoryId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removePartFromProductInventory" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "partsInventoryId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "partsInventoryId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "productInventoryId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "productInventoryId" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemovePartFromProductInventoryMutation,
  RemovePartFromProductInventoryMutationVariables
>;
