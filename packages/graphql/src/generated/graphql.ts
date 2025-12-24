import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Map: { input: any; output: any };
};

export type AdminArea = {
  __typename?: "AdminArea";
  adminLevel: Scalars["Int"]["output"];
  geometry: Scalars["Map"]["output"];
  id: Scalars["ID"]["output"];
  isoCode: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  parentCode: Maybe<Scalars["String"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  adminArea: Maybe<AdminArea>;
  adminAreaByCode: Maybe<AdminArea>;
  adminAreas: Array<AdminArea>;
  childrenByCode: Array<AdminArea>;
};

export type QueryAdminAreaArgs = {
  adminLevel: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
};

export type QueryAdminAreaByCodeArgs = {
  adminLevel: Scalars["Int"]["input"];
  code: Scalars["String"]["input"];
};

export type QueryAdminAreasArgs = {
  adminLevel: Scalars["Int"]["input"];
};

export type QueryChildrenByCodeArgs = {
  childLevel: Scalars["Int"]["input"];
  parentCode: Scalars["String"]["input"];
};

export type AdminAreasQueryVariables = Exact<{
  adminLevel: Scalars["Int"]["input"];
}>;

export type AdminAreasQuery = {
  __typename?: "Query";
  adminAreas: Array<{
    __typename?: "AdminArea";
    id: string;
    name: string;
    isoCode: string;
    geometry: any;
    adminLevel: number;
    parentCode: string | null;
  }>;
};

export const AdminAreasDocument = gql`
  query AdminAreas($adminLevel: Int!) {
    adminAreas(adminLevel: $adminLevel) {
      id
      name
      isoCode
      geometry
      adminLevel
      parentCode
    }
  }
`;

/**
 * __useAdminAreasQuery__
 *
 * To run a query within a React component, call `useAdminAreasQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAreasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAreasQuery({
 *   variables: {
 *      adminLevel: // value for 'adminLevel'
 *   },
 * });
 */
export function useAdminAreasQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    AdminAreasQuery,
    AdminAreasQueryVariables
  > &
    (
      | { variables: AdminAreasQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<AdminAreasQuery, AdminAreasQueryVariables>(
    AdminAreasDocument,
    options,
  );
}
export function useAdminAreasLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AdminAreasQuery,
    AdminAreasQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    AdminAreasQuery,
    AdminAreasQueryVariables
  >(AdminAreasDocument, options);
}
// @ts-ignore
export function useAdminAreasSuspenseQuery(
  baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<
    AdminAreasQuery,
    AdminAreasQueryVariables
  >,
): ApolloReactHooks.UseSuspenseQueryResult<
  AdminAreasQuery,
  AdminAreasQueryVariables
>;
export function useAdminAreasSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminAreasQuery,
        AdminAreasQueryVariables
      >,
): ApolloReactHooks.UseSuspenseQueryResult<
  AdminAreasQuery | undefined,
  AdminAreasQueryVariables
>;
export function useAdminAreasSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<
        AdminAreasQuery,
        AdminAreasQueryVariables
      >,
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useSuspenseQuery<
    AdminAreasQuery,
    AdminAreasQueryVariables
  >(AdminAreasDocument, options);
}
export type AdminAreasQueryHookResult = ReturnType<typeof useAdminAreasQuery>;
export type AdminAreasLazyQueryHookResult = ReturnType<
  typeof useAdminAreasLazyQuery
>;
export type AdminAreasSuspenseQueryHookResult = ReturnType<
  typeof useAdminAreasSuspenseQuery
>;
export type AdminAreasQueryResult = Apollo.QueryResult<
  AdminAreasQuery,
  AdminAreasQueryVariables
>;
