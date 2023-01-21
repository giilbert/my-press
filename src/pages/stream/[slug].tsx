import { Box, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { DefaultQueryCell } from "../../components/utils/default-query-cell";
import { trpc } from "../../utils/trpc";

const StreamPage: NextPage = () => {
  const router = useRouter();
  const streamQuery = trpc.stream.getStreamBySlug.useQuery({
    slug: router.query.slug as string,
  });

  return (
    <DefaultQueryCell
      query={streamQuery}
      success={({ data }) => (
        <Box p="4">
          <Heading>Stream name: {data.name}</Heading>
          <Text>Your permission: {data.permission}</Text>
        </Box>
      )}
      empty={() => <Text>Empty</Text>}
    />
  );
};

export default StreamPage;
