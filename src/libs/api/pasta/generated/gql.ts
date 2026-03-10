/* eslint-disable */
import * as types from "./graphql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "query GetCategories {\n  categories {\n    id\n    name\n  }\n}\n\nmutation CreateCategory($input: CreateCategoryInput!) {\n  createCategory(input: $input) {\n    id\n    name\n  }\n}": typeof types.GetCategoriesDocument;
  "query GetManufacturers {\n  manufacturers {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nquery GetManufacturer($id: UUID!) {\n  manufacturer(id: $id) {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nmutation CreateManufacturer($input: CreateManufacturerInput!) {\n  createManufacturer(input: $input) {\n    id\n    name\n    countryOfOrigin\n  }\n}": typeof types.GetManufacturersDocument;
  "query GetParts {\n  parts {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery GetPart($id: UUID!) {\n  part(id: $id) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery SearchParts($name: String!) {\n  searchParts(name: $name) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation CreatePart($input: CreatePartInput!) {\n  createPart(input: $input) {\n    id\n    name\n    partNumber\n  }\n}\n\nmutation UpdatePart($id: UUID!, $input: UpdatePartInput!) {\n  updatePart(id: $id, input: $input) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation DeletePart($id: UUID!) {\n  deletePart(id: $id)\n}": typeof types.GetPartsDocument;
  "query Test {\n  parts {\n    id\n  }\n}": typeof types.TestDocument;
};
const documents: Documents = {
  "query GetCategories {\n  categories {\n    id\n    name\n  }\n}\n\nmutation CreateCategory($input: CreateCategoryInput!) {\n  createCategory(input: $input) {\n    id\n    name\n  }\n}":
    types.GetCategoriesDocument,
  "query GetManufacturers {\n  manufacturers {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nquery GetManufacturer($id: UUID!) {\n  manufacturer(id: $id) {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nmutation CreateManufacturer($input: CreateManufacturerInput!) {\n  createManufacturer(input: $input) {\n    id\n    name\n    countryOfOrigin\n  }\n}":
    types.GetManufacturersDocument,
  "query GetParts {\n  parts {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery GetPart($id: UUID!) {\n  part(id: $id) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery SearchParts($name: String!) {\n  searchParts(name: $name) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation CreatePart($input: CreatePartInput!) {\n  createPart(input: $input) {\n    id\n    name\n    partNumber\n  }\n}\n\nmutation UpdatePart($id: UUID!, $input: UpdatePartInput!) {\n  updatePart(id: $id, input: $input) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation DeletePart($id: UUID!) {\n  deletePart(id: $id)\n}":
    types.GetPartsDocument,
  "query Test {\n  parts {\n    id\n  }\n}": types.TestDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetCategories {\n  categories {\n    id\n    name\n  }\n}\n\nmutation CreateCategory($input: CreateCategoryInput!) {\n  createCategory(input: $input) {\n    id\n    name\n  }\n}",
): (typeof documents)["query GetCategories {\n  categories {\n    id\n    name\n  }\n}\n\nmutation CreateCategory($input: CreateCategoryInput!) {\n  createCategory(input: $input) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetManufacturers {\n  manufacturers {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nquery GetManufacturer($id: UUID!) {\n  manufacturer(id: $id) {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nmutation CreateManufacturer($input: CreateManufacturerInput!) {\n  createManufacturer(input: $input) {\n    id\n    name\n    countryOfOrigin\n  }\n}",
): (typeof documents)["query GetManufacturers {\n  manufacturers {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nquery GetManufacturer($id: UUID!) {\n  manufacturer(id: $id) {\n    id\n    name\n    countryOfOrigin\n  }\n}\n\nmutation CreateManufacturer($input: CreateManufacturerInput!) {\n  createManufacturer(input: $input) {\n    id\n    name\n    countryOfOrigin\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetParts {\n  parts {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery GetPart($id: UUID!) {\n  part(id: $id) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery SearchParts($name: String!) {\n  searchParts(name: $name) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation CreatePart($input: CreatePartInput!) {\n  createPart(input: $input) {\n    id\n    name\n    partNumber\n  }\n}\n\nmutation UpdatePart($id: UUID!, $input: UpdatePartInput!) {\n  updatePart(id: $id, input: $input) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation DeletePart($id: UUID!) {\n  deletePart(id: $id)\n}",
): (typeof documents)["query GetParts {\n  parts {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery GetPart($id: UUID!) {\n  part(id: $id) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nquery SearchParts($name: String!) {\n  searchParts(name: $name) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturerId\n    organizationId\n    userId\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation CreatePart($input: CreatePartInput!) {\n  createPart(input: $input) {\n    id\n    name\n    partNumber\n  }\n}\n\nmutation UpdatePart($id: UUID!, $input: UpdatePartInput!) {\n  updatePart(id: $id, input: $input) {\n    id\n    name\n    partNumber\n    description\n    condition\n    isAvailable\n    temperatureStage\n    images\n    manufacturer {\n      id\n      name\n      countryOfOrigin\n    }\n    categories {\n      id\n      name\n    }\n  }\n}\n\nmutation DeletePart($id: UUID!) {\n  deletePart(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Test {\n  parts {\n    id\n  }\n}",
): (typeof documents)["query Test {\n  parts {\n    id\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
