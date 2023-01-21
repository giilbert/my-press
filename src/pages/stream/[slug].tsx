import { Box, Button, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { CreatePost } from "../../components/posts/create-post";
import { StreamPostList } from "../../components/posts/stream-list";
import { StreamProvider } from "../../components/streams/stream-provider";
import { trpc } from "../../utils/api";
import { noop } from "../../utils/noop";

const StreamPage: NextPage = () => {
  const subscribeToStream = trpc.stream.subscribe.useMutation();
  const router = useRouter();

  return (
    <StreamProvider>
      {(data) =>
        data.permission ? (
          <Box p="4">
            <Heading>Stream name: {data.name}</Heading>
            <Text>Your permission: {data.permission}</Text>
            <CreatePost />

            <StreamPostList />
          </Box>
        ) : (
          <Box>
            <Text>Subscribe to this stream to view the posts.</Text>

            <Button
              onClick={() => {
                subscribeToStream
                  .mutateAsync({
                    slug: data.slug,
                  })
                  .then(() => {
                    router.reload();
                  })
                  .catch(noop);
              }}
            >
              Subscribe
            </Button>
          </Box>
        )
      }
    </StreamProvider>
  );
};

export default StreamPage;
