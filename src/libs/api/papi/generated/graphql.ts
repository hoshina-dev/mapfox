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
  fileName: Scalars["String"]["input"];
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
