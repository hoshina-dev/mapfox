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

export type MutationUpdatePartArgs = {
  id: Scalars["UUID"]["input"];
  input: UpdatePartInput;
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
  name: Scalars["String"]["output"];
  organizationId: Scalars["UUID"]["output"];
  partNumber: Scalars["String"]["output"];
  temperatureStage?: Maybe<Scalars["String"]["output"]>;
  userId: Scalars["UUID"]["output"];
};

export type Query = {
  __typename?: "Query";
  categories: Array<Category>;
  manufacturer?: Maybe<Manufacturer>;
  manufacturers: Array<Manufacturer>;
  part?: Maybe<Part>;
  parts: Array<Part>;
  searchParts: Array<Part>;
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

export type TestQueryVariables = Exact<{ [key: string]: never }>;

export type TestQuery = {
  __typename?: "Query";
  parts: Array<{ __typename?: "Part"; id: any }>;
};

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
