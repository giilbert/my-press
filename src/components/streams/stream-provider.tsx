import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { type RouterOutputs, trpc } from "../../utils/api";
import { DefaultQueryCell } from "../utils/default-query-cell";

type StreamData = RouterOutputs["stream"]["getStreamBySlug"];

const StreamContext = createContext<StreamData | null>(null);

export const StreamProvider: React.FC<{
  children:
    | ((data: StreamData) => React.ReactElement | null)
    | React.ReactElement;
}> = ({ children }) => {
  const router = useRouter();
  const streamQuery = trpc.stream.getStreamBySlug.useQuery(
    {
      slug: router.query.slug as string,
    },
    { enabled: !!router.query.slug, refetchOnWindowFocus: false }
  );

  return (
    <StreamContext.Provider value={streamQuery.data || null}>
      <DefaultQueryCell
        query={streamQuery}
        success={({ data }) =>
          typeof children === "function" ? children(data) : children
        }
        empty={() => <Text>Empty</Text>}
      />
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const data = useContext(StreamContext);
  if (!data) throw new Error("Attempted to useStream outside of context.");
  return data;
};
