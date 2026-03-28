import type { CodegenConfig } from "@graphql-codegen/cli";

const sharedConfig = {
  preset: "client" as const,
  config: {
    useTypeImports: true,
    enumsAsTypes: true,
  },
};

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    "./src/libs/api/papi/generated/": {
      ...sharedConfig,
      schema: process.env.PAPI_URL || "http://localhost:8080/graphql",
      documents: ["src/libs/api/papi/query/**/*.gql"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
