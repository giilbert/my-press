import { Box, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { StreamProvider } from "../../components/streams/stream-provider";

const StreamPage: NextPage = () => {
  return (
    <StreamProvider>
      {(data) => (
        <Box p="4">
          <Heading>Stream name: {data.name}</Heading>
          <Text>Your permission: {data.permission}</Text>
        </Box>
      )}
    </StreamProvider>
  );
};

export default StreamPage;
