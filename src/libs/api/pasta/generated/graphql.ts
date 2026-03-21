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
  Int64: { input: any; output: any };
  UUID: { input: any; output: any };
};

export type Category = {
  __typename?: "Category";
  id: Scalars["UUID"]["output"];
  name: Scalars["String"]["output"];
};

export type CreateCategoryInput = {
  name: Scalars["String"]["input"];
};

export type CreateManufacturerInput = {
  countryOfOrigin?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type CreatePartInput = {
  categoryIds: Array<Scalars["UUID"]["input"]>;
  condition: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  images: Array<Scalars["String"]["input"]>;
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  manufacturerId: Scalars["UUID"]["input"];
  name: Scalars["String"]["input"];
  organizationId: Scalars["UUID"]["input"];
  partNumber: Scalars["String"]["input"];
  temperatureStage?: InputMaybe<Scalars["String"]["input"]>;
  userId: Scalars["UUID"]["input"];
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
  createCategory: Category;
  createManufacturer: Manufacturer;
  createPart: Part;
  deletePart: Scalars["Boolean"]["output"];
  optimize3D: Optimize3DResponse;
  updatePart: Part;
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

export type MutationDeletePartArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationOptimize3DArgs = {
  input: Optimize3DInput;
};

export type MutationUpdatePartArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdatePartInput;
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
  condition: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  images: Array<Scalars["String"]["output"]>;
  isAvailable: Scalars["Boolean"]["output"];
  manufacturer?: Maybe<Manufacturer>;
  manufacturerId: Scalars["UUID"]["output"];
  models3D: Array<Part3DModel>;
  name: Scalars["String"]["output"];
  organizationId: Scalars["UUID"]["output"];
  partNumber: Scalars["String"]["output"];
  temperatureStage?: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["UUID"]["output"];
};

export type Part3DModel = {
  __typename?: "Part3DModel";
  fileName: Scalars["String"]["output"];
  fileSize?: Maybe<Scalars["Int64"]["output"]>;
  id: Scalars["UUID"]["output"];
  partId: Scalars["UUID"]["output"];
  processedKey?: Maybe<Scalars["String"]["output"]>;
  processedUrl?: Maybe<Scalars["String"]["output"]>;
  rawUrl: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  categories: Array<Category>;
  generateUploadURL: UploadUrlResponse;
  manufacturer?: Maybe<Manufacturer>;
  manufacturers: Array<Manufacturer>;
  part?: Maybe<Part>;
  parts: Array<Part>;
  searchParts: Array<Part>;
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

export type QuerySearchPartsArgs = {
  name: Scalars["String"]["input"];
};

export type UpdatePartInput = {
  categoryIds?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  condition?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  temperatureStage?: InputMaybe<Scalars["String"]["input"]>;
};

export type UploadUrlResponse = {
  __typename?: "UploadURLResponse";
  fileKey: Scalars["String"]["output"];
  uploadURL: Scalars["String"]["output"];
};

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetCategoriesQuery = {
  __typename?: "Query";
  categories: Array<{ __typename?: "Category"; id: any; name: string }>;
};

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
  __typename?: "Mutation";
  createCategory: { __typename?: "Category"; id: any; name: string };
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

export type GetPartsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPartsQuery = {
  __typename?: "Query";
  parts: Array<{
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    condition: string;
    isAvailable: boolean;
    temperatureStage?: string | null;
    images: Array<string>;
    manufacturerId: any;
    organizationId: any;
    userId: any;
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
    condition: string;
    isAvailable: boolean;
    temperatureStage?: string | null;
    images: Array<string>;
    manufacturerId: any;
    organizationId: any;
    userId: any;
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
    }> | null;
  } | null;
};

export type SearchPartsQueryVariables = Exact<{
  name: Scalars["String"]["input"];
}>;

export type SearchPartsQuery = {
  __typename?: "Query";
  searchParts: Array<{
    __typename?: "Part";
    id: any;
    name: string;
    partNumber: string;
    description?: string | null;
    condition: string;
    isAvailable: boolean;
    temperatureStage?: string | null;
    images: Array<string>;
    manufacturerId: any;
    organizationId: any;
    userId: any;
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
    }> | null;
  }>;
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
    condition: string;
    isAvailable: boolean;
    temperatureStage?: string | null;
    images: Array<string>;
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
    }> | null;
  };
};

export type DeletePartMutationVariables = Exact<{
  id: Scalars["UUID"]["input"];
}>;

export type DeletePartMutation = {
  __typename?: "Mutation";
  deletePart: boolean;
};

export type TestQueryVariables = Exact<{ [key: string]: never }>;

export type TestQuery = {
  __typename?: "Query";
  parts: Array<{ __typename?: "Part"; id: any }>;
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
                { kind: "Field", name: { kind: "Name", value: "condition" } },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organizationId" },
                },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
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
                { kind: "Field", name: { kind: "Name", value: "condition" } },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organizationId" },
                },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
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
export const SearchPartsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchParts" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "searchParts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
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
                { kind: "Field", name: { kind: "Name", value: "condition" } },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "manufacturerId" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organizationId" },
                },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
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
} as unknown as DocumentNode<SearchPartsQuery, SearchPartsQueryVariables>;
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
                { kind: "Field", name: { kind: "Name", value: "condition" } },
                { kind: "Field", name: { kind: "Name", value: "isAvailable" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "temperatureStage" },
                },
                { kind: "Field", name: { kind: "Name", value: "images" } },
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
export const TestDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Test" },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TestQuery, TestQueryVariables>;
