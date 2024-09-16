import { Loader } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { GetFlow } from "convex/flow";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";

export default function FlowPreview() {
  const params = useParams();
  const get = useAction(api.flow.get);

  const [data, setData] = useState<GetFlow | null>(null);

  useEffect(() => {
    get({ flowId: params.flowId || "" }).then((value) => setData(value));
  }, [get, params]);

  if (!data) {
    return <Loader size="xl" />;
  }

  return (
    <iframe
      title={data.name}
      src={data?.preview.preview_url}
      width="100%"
      height="900"
    />
  );
}
