import { Box, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { CreatePost } from "../../components/posts/create-post";
import { StreamPostList } from "../../components/posts/stream-list";
import { StreamProvider } from "../../components/streams/stream-provider";

const StreamPage: NextPage = () => {
  return (
    <StreamProvider>
      {(data) => (
        <Box p="4">
          <Heading>Stream name: {data.name}</Heading>
          <Text>Your permission: {data.permission}</Text>
          <CreatePost />

          <StreamPostList />
        </Box>
      )}
    </StreamProvider>
  );
};

export default StreamPage;
