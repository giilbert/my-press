import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";
import { useStream } from "../streams/stream-provider";

export const StreamPostList: React.FC = () => {
  const stream = useStream();
  const postsQuery = trpc.post.listOfStream.useInfiniteQuery(
    {
      streamId: stream.id,
    },
    {
      getNextPageParam: (curr) => curr.nextCursor,
    }
  );
  const posts = postsQuery.data?.pages.map((page) => page.posts).flat();

  // TODO: infinite query more posts
  return (
    <VStack w="full">
      {posts?.map((post) => (
        <Box
          border="solid #aaa 1px"
          mt="2"
          p="4"
          w="full"
          borderRadius="sm"
          key={post.id}
        >
          <Heading fontSize="xl">{post.title}</Heading>
          <Text fontSize="md">{post.content}</Text>
        </Box>
      ))}
    </VStack>
  );
};
