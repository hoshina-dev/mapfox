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
    "./src/libs/api/pasta/generated/": {
      ...sharedConfig,
      schema: "http://pasta.mapfox.hoshina.san/graphql",
      documents: ["src/libs/api/pasta/query/**/*.gql"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
