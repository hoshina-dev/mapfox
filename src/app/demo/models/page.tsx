import { Alert, Text } from "@mantine/core";

import { listModels } from "@/app/actions/models";
import { ModelBrowser } from "@/components/viewer/ModelBrowser";

export const metadata = {
  title: "Demo: 3D Viewer | Mapfox",
  description: "Browse and view 3D GLB models",
};

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const result = await listModels();

  if (!result.success) {
    return (
      <Alert color="red" title="Error loading models" m="xl">
        <Text>{result.error}</Text>
      </Alert>
    );
  }

  return <ModelBrowser parts={result.data.parts} />;
}
