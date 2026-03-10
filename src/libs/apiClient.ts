// API used here is not exposed to frontend, only used in server components and API routes

import "server-only";

import { GraphQLClient } from "graphql-request";

import { Configuration, OrganizationsApi, UsersApi } from "./api/custapi";

// GraphQL

const GAPI_URL = process.env.GAPI_URL || "http://localhost:8080/query";

export const gapiClient = new GraphQLClient(GAPI_URL, {
  headers: {
    "Content-Type": "application/json",
  },
});

const PASTA_URL = process.env.PASTA_URL || "http://localhost:8080/graphql";

export const pastaClient = new GraphQLClient(PASTA_URL, {
  headers: {
    "Content-Type": "application/json",
  },
});

// REST

const CUSTAPI_URL = process.env.CUSTAPI_URL || "http://localhost:8000/api/v1";

const configuration = new Configuration({
  basePath: CUSTAPI_URL,
});

export const organizationsApi = new OrganizationsApi(configuration);
export const usersApi = new UsersApi(configuration);
