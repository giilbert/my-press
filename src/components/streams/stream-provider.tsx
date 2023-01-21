import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { createContext, useContext } from "react";
import { type RouterOutputs, trpc } from "../../utils/api";
import { DefaultQueryCell } from "../utils/default-query-cell";

type StreamData = RouterOutputs["stream"]["getStreamBySlug"];

const StreamContext = createContext<StreamData | null>(null);

export const StreamProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const streamQuery = trpc.stream.getStreamBySlug.useQuery(
    {
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug, refetchOnWindowFocus: false }
  );

  return (
    <DefaultQueryCell
      query={streamQuery}
      success={({ data }) => (
        <StreamContext.Provider value={data}>{children}</StreamContext.Provider>
      )}
      empty={() => <Text>Empty</Text>}
    />
  );
};

export const useStream = () => {
  const data = useContext(StreamContext);
  if (!data) throw new Error("Attempted to useStream outside of context.");
  return data;
};
