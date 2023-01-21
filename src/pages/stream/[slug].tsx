import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CreatePost } from "../../components/posts/create-post";
import { StreamPostList } from "../../components/posts/stream-list";
import {
  StreamProvider,
  useStream,
} from "../../components/streams/stream-provider";
import type { CustomNextPage } from "../../types/next-page";
import { trpc } from "../../utils/api";
import { noop } from "../../utils/noop";

const StreamPage: CustomNextPage = () => {
  const subscribeToStream = trpc.stream.subscribe.useMutation();
  const router = useRouter();
  const stream = useStream();

  if (stream.permission) {
    return (
      <Box p="4">
        <Heading>Stream name: {stream.name}</Heading>
        <Text>Your permission: {stream.permission}</Text>
        {stream.permission !== "MEMBER" && <CreatePost />}

        <StreamPostList />
      </Box>
    );
  }

  return (
    <Box>
      <Text>Subscribe to this stream to view the posts.</Text>

      <Button
        onClick={() => {
          subscribeToStream
            .mutateAsync({
              slug: stream.slug,
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
  );
};

StreamPage.auth = true;

StreamPage.getLayout = (page) => <StreamProvider>{page}</StreamProvider>;

export default StreamPage;
